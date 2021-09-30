module.exports = {
	apps: [
		{
			name: "fillmyform-server-prod",
			script: "start npm -- start",
			interpreter: "none",
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
