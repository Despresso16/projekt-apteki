import jwt from "jsonwebtoken";

export default function generateSession(token, expiry) {
    return jwt.sign({token: token}, process.env.jwtSecret, {expiresIn: expiry, algorithm: "HS512"});
}