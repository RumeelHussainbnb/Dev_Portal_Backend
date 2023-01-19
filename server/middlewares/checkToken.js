import jwt from "jsonwebtoken";

export const handleTokenValidation = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, "ghjsgdagfzdugfdhfljdshfidsufsd");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.log("err ==>", err);
    // const error = new Error("Authentication failed!", 403);
    return res.status(400).json({ message: "token is expire" });
  }
};
