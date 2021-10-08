// import { Request, Response, NextFunction } from "express";
// import redis from "../db/redisConfig";

// function rateLimiter(secondsWindow: number, allowedHits: number) {
// 	return async function (req: Request, res: Response, next: NextFunction) {
// 		const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

// 		if (!ip) return;

// 		const requests = redis.incr(ip);

// 		if (requests === 1) {
// 			redis.expire(ip, secondsWindow);
// 		}
// 	};
// }
