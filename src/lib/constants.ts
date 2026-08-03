// Visibility flags
export const K_VIS_THIS = 0x80;
export const K_VIS_DAUGHTER = 0x8;

// jsroot types and properties
export const T_GEO_SPHERE = "TGeoSphere";
export const T_GEO_COMPOSITE_SHAPE = "TGeoCompositeShape";
export const T_GEO_B_BOX_IDENTITY_FIELDS = new Set([
  "fUniqueID",
  "fBits",
  "fName",
  "fTitle",
  "fShapeId",
  "fShapeBits",
]);
export const MATRIX_TYPES = new Set([
  "TGeoIdentity",
  "TGeoTranslation",
  "TGeoRotation",
  "TGeoScale",
  "TGeoCombiTrans",
  "TGeoGenTrans",
  "TGeoHMatrix",
]);

// Sphere segment counts
export const SPHERE_NSEG = 3;
export const SPHERE_NZ = 3;

// jsroot build parameters
export const GEO_GRAD_PER_SEGM = 360 / 30;
export const BUILD_OPTIONS = {
  vislevel: 100, // guardrail on the depth of the geometry hierarchy to traverse and render
  // numnodes: 1000, // guardrail on the total number of visible nodes across the whole scene
  numfaces: 1000, // guardrail on the total number of triangle faces across the whole scene
  // dflt_colors: false, // avoids overriding predefined colors
  // no_screen: false, // ignores kVisOnScreen visibility bits when set
  // composite: false, // unfolds composite shapes into separate parts
  // showtop: false, // renders the top/master volume (TGeoManager only)
  // instancing: -1, // -1 disables InstancedMesh, 1 forces it, 0 lets jsroot decide
  // frustum: null, // camera frustum used for LOD culling (irrelevant when rendering headless)
  // material_kind: "lambert", // three.js material used for generated meshes
  // set_names: true, // attaches volume names to generated meshes
};

// Minimum distance from the parent volume to be considered rudundant
export const THRESHOLD = 1e-4;
