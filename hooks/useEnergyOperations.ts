import {
  Dispatch,
  SetStateAction
} from 'react'

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

interface updateServiceInterface {
  id: number,
  able?: number
}

interface updateServicePayloadInterface {
  able?: number
}

interface Params {
  setUpdate?: Dispatch<SetStateAction<boolean>>
}

export default function useEnergyOperations({ setUpdate }: Params) {
  const alertHook = useAlert()
  
  async function create({ dealership, state, city, update_time }: createMonitoringInterface) {
    if (!!dealership && !!state && !!city && !!update_time) {
      const token = localStorage.getItem('userToken')
      
      await apiEnergy.post<createResponse>('/service/cpfl', { dealership, state, city, update_time }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
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

  async function update({ id, able }: updateServiceInterface) {
    const token = localStorage.getItem('userToken')
    let payload: updateServicePayloadInterface = {}

    if (!!able) {
      payload.able = able
    }

    console.log(payload)

    return await apiEnergy.put(`/service/cpfl/${id}`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        alertHook.showAlert('serviço atualizado com sucesso!', 'success')

        if (!!setUpdate) {
          setUpdate(true)
        }

        return true
      })
      .catch(error => {
        console.log(error)

        alertHook.showAlert('erro ao atualizar serviço, por favor, tente novamente!', 'error')

        return false
      })
  }
  
  return {
    create,
    update
  }  
}