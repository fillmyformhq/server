module.exports = {
	apps: [
		{
			name: "fillmyform-server-prod",
			script: "npx",
			args: "serve -s dist -l 8080 -n",
			interpreter: "none",
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
