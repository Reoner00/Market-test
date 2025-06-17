import jsonWebToken from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.header.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization failed :( " });
  }

  jsonWebToken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Authorization failed (bad token) :( " });
    }
  });

  next();
  //   req.body.userID = decoded.userID;
};

export default auth;
