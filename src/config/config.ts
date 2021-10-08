import { config } from "dotenv";
config();

const environment: string = process.env.NODE_ENV || "development";

interface IConfig {
	PORT: number;
	JWT_SECRET: string;
	DB_HOST: string;
	DB_PASSWORD: string;
	DB_USER: string;
	DB_NAME: string;
	REDIS_HOST: string;
	REDIS_PORT: number;
}

const configSettings: IConfig =
	environment === "development"
		? {
				PORT: 8080,
				JWT_SECRET: "fhjghldjghjfasdfadskf34343432433432",
				DB_HOST: "fillmyform-dev.cm0hbjphferi.ap-south-1.rds.amazonaws.com",
				DB_USER: "postgres",
				DB_PASSWORD: "KRISHna7373",
				DB_NAME: "postgres",
				REDIS_HOST: "127.0.0.1",
				REDIS_PORT: 6379,
		  }
		: {
				PORT: parseInt(process.env.PORT ? process.env.PORT : "8080"),
				JWT_SECRET:
					process.env.JWT_SECRET || "fhjghldjghjfasdfadskf34343432433432",
				DB_HOST:
					process.env.DB_HOST ||
					"fillmyform-dev.cm0hbjphferi.ap-south-1.rds.amazonaws.com",
				DB_USER: "postgres",
				DB_PASSWORD: process.env.DB_PASSWORD || "KRISHna7373",
				DB_NAME: "postgres",
				REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
				REDIS_PORT: parseInt(process.env.PORT ? process.env.PORT : "6379"),
		  };

export default configSettings;
