import jwt from "jsonwebtoken";

export default function validateAuth(req) {
    if (!req.headers['authorization']) return false;
    const token = req.headers['authorization'];
    try {
        const session = jwt.verify(token, process.env.jwtSecret);
        return session.token;
    } catch (err) {
        return true;
    }
}