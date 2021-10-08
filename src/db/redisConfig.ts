import redis from "redis";
import config from "../config/config";

interface IOptions {
	host: string;
	port: number;
}

const options: IOptions = {
	host: config.REDIS_HOST,
	port: config.REDIS_PORT,
};

const redisClient = redis.createClient(options);

redisClient.on("connect", () => {
	console.log("redis client connected");
});

export default redisClient;
