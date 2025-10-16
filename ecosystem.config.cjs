module.exports = {
  apps: [
    {
      name: 'discord-bot',
      cwd: __dirname,
      script: 'index.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
