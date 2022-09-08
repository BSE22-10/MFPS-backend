import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const jwtVerify = (req, res, next) => {
  const token = req.headers["x-access-header"];

  if (!token) {
    throw new Error("Token not provided");
  } else {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        throw new Error("Failed to authenticate");
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};
