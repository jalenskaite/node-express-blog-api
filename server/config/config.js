import config from './config.json'
const env = process.env.NODE_ENV || 'development'

if (env === 'development' || env === 'test') {
  const envConfig = config[env]

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}
