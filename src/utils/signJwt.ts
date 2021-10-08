import jwt from "jsonwebtoken";
import config from "../config/config";

const JWT_SECRET: string = config.JWT_SECRET;

const signJwt = (id: string): string => {
	const token = jwt.sign({ id }, JWT_SECRET);
	return token;
};

export default signJwt;
