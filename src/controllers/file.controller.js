import { convertGeometry } from '../phoenixExport';

async function parseFile(req, res) {
  try {
    const {
      file, body: {
        maxLevel, subParts, childrenToHide, objectName,
      },
    } = req;

    // Converts the subParts string paths to RegExp objects
    for (const [, entry] of Object.entries(subParts)) {
      const temp = [];
      for (const subPath of entry[0]) {
        temp.push(new RegExp(subPath));
      }
      entry[0] = temp;
    }

    const gltf = await convertGeometry(
      file.path,
      maxLevel,
      subParts,
      childrenToHide,
      objectName,
    );

    return res.status(200).json(gltf);
  } catch (error) {
    return res.res.status(500).send(error);
  }
}

// eslint-disable-next-line import-x/prefer-default-export
export { parseFile };
