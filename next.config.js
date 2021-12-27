/** @type {import('next').NextConfig} */
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  env: {
    PRODUCTION_BASE_URL: process.env.PRODUCTION_BASE_URL,
    PRODUCTION_ENERGY_BASE_URL: process.env.PRODUCTION_ENERGY_BASE_URL
  }
}
