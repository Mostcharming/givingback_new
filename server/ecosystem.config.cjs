module.exports = {
  apps: [
    {
      name: "givingback-server",
      cwd: __dirname,
      script: "dist/src/index.js",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
      },
      kill_timeout: 5000,
    },
  ],
};
