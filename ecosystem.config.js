module.exports = {
  apps: [
    {
      name: 'frontend',
      exec_mode: 'cluster',
      port: 8082,
      host: "0.0.0.0",
      instances: '4', // Or a number of instances
      script: './node_modules/@vue/cli-service/bin/vue-cli-service.js',
      args: 'serve'
    }
  ]
}