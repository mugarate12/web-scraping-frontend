import { apiEnergy } from './../config'

import {
  useAlert
} from './'

interface createResponse {
  message: string
}

interface createMonitoringInterface {
  dealership: string,
  state: string,
  city: string,
  update_time: number
}

export default function useEnergyOperations() {
  const alertHook = useAlert()
  
  async function create({ dealership, state, city, update_time }: createMonitoringInterface) {
    if (!!dealership && !!state && !!city && !!update_time) {
      await apiEnergy.post<createResponse>('/service/cpfl', { dealership, state, city, update_time })
        .then(response => {
          alertHook.showAlert('monitoramento criado com sucesso!', 'success')
        })
        .catch(error => {
          alertHook.showAlert('serviço já pode existir, por favor, tente novamente!', 'error')
        })
    } else {
      alertHook.showAlert('preencha todos os campos!', 'warning')
    }
  }
  
  return {
    create
  }  
}