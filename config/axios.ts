import axios from 'axios'

const developmentURL = 'http://localhost:3333'
const productionURL = String(process.env.PRODUCTION_BASE_URL)

const api = axios.create({
  baseURL: productionURL
  // baseURL: 'http://3.85.142.172:3333'
})

export default api