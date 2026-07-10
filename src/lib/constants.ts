// Visibility flags
export const K_VIS_THIS = 0x80;
export const K_VIS_DAUGHTER = 0x8;

// Root type names
export const TGEO_SPHERE = "TGeoSphere";
export const TGEO_COMPOSITE_SHAPE = "TGeoCompositeShape";

// Sphere segment counts
export const SPHERE_NSEG = 3;
export const SPHERE_NZ = 3;

// jsroot build parameters
export const GEO_GRAD_PER_SEGM = 360 / 24;
export const BUILD_OPTIONS = {
  dflt_colors: true, // assigns default ROOT colors to volumes that don't have an explicit fill color set
  vislevel: 10, // max depth of the geometry hierarchy to traverse and render
  numfaces: 10000000, // cap on the total number of triangle faces across the whole scene
  numnodes: 500000, // cap on the total number of visible nodes across the whole scene
};

// Color palette applied per subpart, cycled by index if there are more subparts than colors
export const COLOR_PALETTE = [
  "#fb2c36",
  "#ff6900",
  "#fe9a00",
  "#f0b100",
  "#7ccf00",
  "#00c950",
  "#00bc7d",
  "#00bba7",
  "#00b8db",
  "#00a6f4",
  "#2b7fff",
  "#615fff",
  "#8e51ff",
  "#ad46ff",
  "#e12afb",
  "#f6339a",
  "#ff2056",
];
