import axios from 'axios'

const developmentURL = 'http://localhost:3333'
const productionURL = String(process.env.PRODUCTION_BASE_URL)

const api = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? developmentURL : productionURL
  baseURL: 'http://3.86.91.4:3333'
})

export default api