import { apiEnergy } from './../config'

import {
  useAlert
} from './'

interface createResponse {
  message: string
}

interface createMonitoringInterface {
  state: string,
  city: string
}

export default function useEnergyOperations() {
  const alertHook = useAlert()
  
  async function create({ state, city }: createMonitoringInterface) {
    if (!!state && !!city) {
      await apiEnergy.post<createResponse>('/service/cpfl', { state, city })
        .then(response => {
          alertHook.showAlert('monitoramento criado com sucesso!', 'success')
        })
        .catch(error => {
          alertHook.showAlert('error ao criar monitoramento, tente novamente!', 'error')
        })
    } else {
      alertHook.showAlert('preencha todos os campos!', 'warning')
    }
  }
  
  return {
    create
  }  
}