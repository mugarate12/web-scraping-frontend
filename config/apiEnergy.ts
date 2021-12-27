import axios from 'axios'

const developmentURL = 'http://localhost:3333'
const productionURL = String(process.env.PRODUCTION_ENERGY_BASE_URL)

const api = axios.create({
  baseURL: developmentURL
  // baseURL: 'http://3.85.142.172:3333'
  // baseURL: productionURL
})

export default api