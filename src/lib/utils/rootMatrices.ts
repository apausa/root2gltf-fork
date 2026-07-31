import { IDENTITY } from "../constants.js";

// Checks translation relative to the parent
export const isNotTranslated = (translationMatrix?: ArrayLike<number>) =>
  !translationMatrix ||
  // Compute difference between translation matrix and 0s matrix
  Array.from(translationMatrix).every((n) => Math.abs(n) < 1e-8);

// Checks rotation relative to the parent
export const isNotRotated = (rotationMatrix?: ArrayLike<number>) =>
  !rotationMatrix ||
  // Compute difference between rotation matrix and identity matrix
  IDENTITY.every((e, i) => Math.abs(Array.from(rotationMatrix)[i]! - e) < 1e-8);

// Checks scale relative to the parent
export const isNotScaled = (scalingMatrix?: ArrayLike<number>) =>
  !scalingMatrix ||
  // Compute difference between scaling matrix and 1s matrix
  Array.from(scalingMatrix).every((n) => Math.abs(n - 1) < 1e-8);
