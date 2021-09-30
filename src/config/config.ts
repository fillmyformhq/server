const environment: string = process.env.NODE_ENV || "development";

interface IConfig {
	PORT: number;
	JWT_SECRET: string;
	DB_HOST: string;
	DB_PASSWORD: string;
	DB_USER: string;
	DB_NAME: string;
}

const config: IConfig =
	environment === "development"
		? {
				PORT: 8080,
				JWT_SECRET: "fhjghldjghjfasdfadskf34343432433432",
				DB_HOST: "fillmyform-dev.cm0hbjphferi.ap-south-1.rds.amazonaws.com",
				DB_USER: "postgres",
				DB_PASSWORD: "KRISHna7373",
				DB_NAME: "postgres",
		  }
		: {
				PORT: 8080,
				JWT_SECRET: process.env.JWT_SECRET || "",
				DB_HOST: process.env.DB_HOST || "",
				DB_USER: "postgres",
				DB_PASSWORD: process.env.DB_PASSWORD || "",
				DB_NAME: "postgres",
		  };

export default config;
