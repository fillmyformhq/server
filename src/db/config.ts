import knex, { Knex } from "knex";
import configSettings from "../config/config";

const db: Knex = knex({
	client: "pg",
	version: "13.4",
	connection: {
		host: configSettings.DB_HOST,
		user: configSettings.DB_USER,
		password: configSettings.DB_PASSWORD,
		database: configSettings.DB_NAME,
	},
});

export default db;
