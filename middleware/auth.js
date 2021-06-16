const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token)
    return res
      .status(400)
      .send("Authentication rejected: there is not a token");

  token = token.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .send("Authentication rejected: there is not a token");

  //cHECK Token

  try {
    const payload = jwt.verify(token, process.env.secretKey);

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).send("Authentication rejected: Invalid token");
  }
};

module.exports = auth;
