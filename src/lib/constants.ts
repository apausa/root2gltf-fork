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
export const BUILD_OPTIONS = { dflt_colors: false }; // avoids overriding predefined colors

// Minimum distance from the parent volume to be considered rudundant
export const THRESHOLD = 1e-4;
