module.exports = {
	apps: [
		{
			name: "fillmyform-server-prod",
			script: "pm2",
			args: "start npm -- start",
			interpreter: "none",
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
