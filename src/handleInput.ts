import {
  K_VIS_DAUGHTER,
  K_VIS_THIS,
  MATRIX_TYPES,
  SHRINK_FACTOR,
  SPHERE_NSEG,
  SPHERE_NZ,
  T_GEO_B_BOX_IDENTITY_FIELDS,
  T_GEO_COMPOSITE_SHAPE,
  T_GEO_SPHERE,
  THRESHOLD,
} from "./lib/constants.js";
import type { TGeoNodeMatrix, TGeoVolume } from "./lib/types/root.js";

// Filter out all volume subparts within the hidden paths and beyond a maximum level
export const removeTrees = (
  node: TGeoNodeMatrix,
  hiddenPaths: Set<string>,
  maxLevel: number,
): void => {
  const stack: { node: TGeoNodeMatrix; level: number }[] = [{ node, level: 0 }];

  while (stack.length) {
    const { node: current, level } = stack.pop()!;

    if (current.fVolume.fNodes) {
      const nodes = current.fVolume.fNodes.arr;
      let j = 0;

      nodes.forEach((n) => {
        if (level < maxLevel && !hiddenPaths.has(n.fName)) nodes[j++] = n;
      });

      nodes.length = j;

      nodes.forEach((n) => stack.push({ node: n, level: level + 1 }));
    }
  }
};

// Makes given node and all its children invisible
export const hideTree = (node: TGeoNodeMatrix): void => {
  const stack: TGeoNodeMatrix[] = [node];

  while (stack.length) {
    const current = stack.pop()!;

    current.fVolume.fGeoAtt &= ~K_VIS_THIS;

    if (current.fVolume.fNodes) stack.push(...current.fVolume.fNodes.arr);
  }
};

// Avoid megabytes for near-flat shapes like Rich mirrors
const reshapeSphere = (shape: any): void => {
  if (shape._typename === T_GEO_SPHERE) {
    // Reduce the number of faces in a sphere
    shape.fNseg = SPHERE_NSEG;
    shape.fNz = SPHERE_NZ;
  } else if (shape._typename === T_GEO_COMPOSITE_SHAPE) {
    // Recurse shape
    reshapeSphere(shape.fNode.fLeft);
    reshapeSphere(shape.fNode.fRight);
  }
};

// Makes given node visible
export const showNode = (node: TGeoNodeMatrix): void => {
  node.fVolume.fGeoAtt |= K_VIS_THIS;

  reshapeSphere(node.fVolume.fShape);
};

// Returns true for matrices that neither translates, rotates nor scales relative to their parent.
const arePositionsEqual = (m: any): boolean => {
  // Checks translation relative to the parent
  const isNotTranslated = (translationMatrix?: ArrayLike<number>) =>
    !translationMatrix ||
    // Compute difference between translation matrix and 0s matrix
    Array.from(translationMatrix).every((n) => Math.abs(n) < THRESHOLD);

  // Checks rotation relative to the parent
  const isNotRotated = (rotationMatrix?: ArrayLike<number>) =>
    !rotationMatrix ||
    // Compute difference between rotation matrix and identity matrix
    [1, 0, 0, 0, 1, 0, 0, 0, 1].every(
      (e, i) => Math.abs(Array.from(rotationMatrix)[i]! - e) < THRESHOLD,
    );

  // Checks scale relative to the parent
  const isNotScaled = (scalingMatrix?: ArrayLike<number>) =>
    !scalingMatrix ||
    // Compute difference between scaling matrix and 1s matrix
    Array.from(scalingMatrix).every((n) => Math.abs(n - 1) < THRESHOLD);

  if (MATRIX_TYPES.has(m._typename)) {
    const fRotation = m.fRotationMatrix ?? m.fRotation?.fRotationMatrix;

    return (
      isNotTranslated(m.fTranslation) &&
      isNotRotated(fRotation) &&
      isNotScaled(m.fScale)
    );
  }

  return false;
};

// Returns true for shapes that have the same dimensions as their parents
const areDimensionsEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;

  // Filters out identity fields and sorts the remaining ones for later comparison
  const kA = Object.keys(a as Record<string, unknown>)
    .filter((k) => !T_GEO_B_BOX_IDENTITY_FIELDS.has(k))
    .sort();

  const kB = Object.keys(b as Record<string, unknown>)
    .filter((k) => !T_GEO_B_BOX_IDENTITY_FIELDS.has(k))
    .sort();

  // If amount or name of keys does not match then shapes are not equal
  if (kA.length !== kB.length || kA.some((k, i) => k !== kB[i])) return false;

  return kA.every((key) => {
    const vA = (a as Record<string, unknown>)[key];
    const vB = (b as Record<string, unknown>)[key];

    // If difference in value is less than THRESHOLD then shapes are equal
    if (typeof vA === "number" && typeof vB === "number")
      return Math.abs(vA - vB) < THRESHOLD;

    // If property is not numeric then recurse function
    return areDimensionsEqual(vA, vB);
  });
};

// Scales down every dimension field of a shape so it renders slightly inside its identical parent.
const shrinkShape = (shape: unknown): void => {
  const stack: unknown[] = [shape];
  const seen = new Set();

  while (stack.length) {
    const current = stack.pop();

    if (!!current && typeof current === "object" && !seen.has(current)) {
      seen.add(current);

      Object.entries(current as Record<string, unknown>).forEach(
        ([key, value]) => {
          if (T_GEO_B_BOX_IDENTITY_FIELDS.has(key)) return;

          if (typeof value === "number")
            (current as Record<string, unknown>)[key] = value * SHRINK_FACTOR;
          else stack.push(value);
        },
      );
    }
  }
};

// Makes given node and all its children visible
const showTree = (node: TGeoNodeMatrix): void => {
  const stack: { node: TGeoNodeMatrix; parent: TGeoVolume | null }[] = [
    { node, parent: null },
  ];

  while (stack.length) {
    const { node: current, parent } = stack.pop()!;

    if (
      parent !== null &&
      arePositionsEqual(current.fMatrix) &&
      areDimensionsEqual(parent.fShape, current.fVolume.fShape) &&
      typeof current.fVolume.fShape === "object" &&
      current.fVolume.fShape
    )
      shrinkShape(current.fVolume.fShape);

    if (current.fVolume.fFillStyle !== 0) showNode(current);

    if (current.fVolume.fNodes) {
      stack.push(
        ...current.fVolume.fNodes.arr.map((n) => ({
          node: n,
          parent: current.fVolume,
        })),
      );
    }
  }
};

// Find and show all volume subparts within the target paths
export const findTrees = (
  node: TGeoNodeMatrix,
  paths: Set<string>,
): boolean => {
  if (!node.fVolume.fNodes) return false;

  let isFound = false;

  node.fVolume.fNodes.arr.forEach((n) => {
    if (paths.has(n.fName)) {
      // Make given node and all its children visible
      showTree(n);
      // Mark found
      isFound = true;
    } else if (findTrees(n, paths)) {
      // If the node name did not match one of the target paths
      // but one of its children's did, then set visibility flag
      n.fVolume.fGeoAtt |= K_VIS_DAUGHTER;
      isFound = true;
    }
  });

  return isFound;
};
