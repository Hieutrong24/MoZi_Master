
import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  let optionsCookies = {
    httpOnly: true, 
    path: "/",      
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production", 
  };

  res.cookie("token", token, optionsCookies);
};

export default generateToken;