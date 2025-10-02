import rateLimit from "express-rate-limit";

// Light global limiter (tune as needed)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 200,            // 200 req/min per IP
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
