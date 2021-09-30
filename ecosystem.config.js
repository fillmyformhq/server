module.exports = {
	apps: [
		{
			name: "fillmyform-server-prod",
			script: "npx",
			args: "start",
			interpreter: "none",
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
