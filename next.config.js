/** @type {import('next').NextConfig} */
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  reactStrictMode: true,
  env: {
    PRODUCTION_BASE_URL: process.env.PRODUCTION_BASE_URL
  }
}
