import { rateLimit } from "express-rate-limit";
import ms from "ms";

export const SetRateLimit = (args) => rateLimit({
    windowMs: ms(args.window),
    max: args.max,
    message: (req, res) => res.status(403).json({status: "error", data: "Rate limit exceeded"})
});