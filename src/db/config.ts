import knex from "knex";
import configSettings from "../config/config";

const db = knex({
	client: "pg",
	version: "12.5",
	connection: {
		host: configSettings.DB_HOST,
		user: configSettings.DB_USER,
		password: configSettings.DB_PASSWORD,
		database: configSettings.DB_NAME,
	},
});

export default db;
