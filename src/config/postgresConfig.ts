import knex, { Knex } from "knex";
import config from "./config";

const db: Knex = knex({
	client: "pg",
	version: "13.4",
	connection: {
		host: config.DB_HOST,
		user: config.DB_USER,
		password: config.DB_PASSWORD,
		database: config.DB_NAME,
	},
});

export default db;
