async function parseFile(req, res) {
  try {
    console.log(req);

    res.status(201);
    return res.send({});
  } catch (error) {
    res.status(500);
    return res.send(error);
  }
}

// eslint-disable-next-line import-x/prefer-default-export
export { parseFile };
