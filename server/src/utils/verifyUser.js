import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).send({ message: "UnAuthorized", Token: token });
  }

  jwt.verify(token, process.env.KEY, (err, user) => {
    if (err) {
      return res
        .status(401)
        .send({ message: "UnAuthorized", error: err.message });
    }
    req.user = user;
    next();
  });
};
