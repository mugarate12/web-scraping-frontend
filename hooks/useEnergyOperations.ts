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
  update_time: number,
  clientsKeys: Array<number>
}

interface updateServiceInterface {
  id: number,
  able?: number,
  updateTime?: number
}

interface updateServicePayloadInterface {
  able?: number,
  updateTime?: number
}

interface Params {
  setUpdate?: Dispatch<SetStateAction<boolean>>
}

export default function useEnergyOperations({ setUpdate }: Params) {
  const alertHook = useAlert()
  
  async function create({ dealership, state, city, update_time, clientsKeys }: createMonitoringInterface) {
    if (!!dealership && !!state && !!city && !!update_time && !!clientsKeys && clientsKeys.length > 0) {
      const token = localStorage.getItem('userToken')
      
      await apiEnergy.post<createResponse>('/service/cpfl', { dealership, state, city, update_time, clientsKeys }, {
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

  async function update({ id, able, updateTime }: updateServiceInterface) {
    const token = localStorage.getItem('userToken')
    let payload: updateServicePayloadInterface = {}

    if (!!able) {
      payload.able = able
    }
    
    if (!!updateTime) {
      payload.updateTime = updateTime
    }

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

  async function updateManually(state: string, city: string) {
    await apiEnergy.get(`/cpfl/singleUpdate/${state}/${city}`)
      .then(() => {
        alertHook.showAlert('serviço atualizado com sucesso!', 'success')
      })
      .catch(error => {
        console.log(error)

        alertHook.showAlert('erro ao atualizar serviço, tente novamente', 'error')
      })
  }

  async function updateManuallyEquatorial(state: string, city: string) {
    await apiEnergy.get(`/equatorial/singleUpdate/${state}/${city}`)
      .then(() => {
        alertHook.showAlert('serviço atualizado com sucesso!', 'success')
      })
      .catch(error => {
        console.log(error)

        alertHook.showAlert('erro ao atualizar serviço, tente novamente', 'error')
      })
  }

  async function remove(id: number) {
    const token = localStorage.getItem('userToken')
    let result =  false

    await apiEnergy.delete(`/service/cpfl/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        alertHook.showAlert('serviço deletado com sucesso!', 'success')

        result = true
      })
      .catch(() => {
        alertHook.showAlert('erro ao deletar serviço, tente novamente', 'error')
      })

    return result
  }
  
  return {
    create,
    update,
    updateManually,
    updateManuallyEquatorial,
    remove
  }  
}