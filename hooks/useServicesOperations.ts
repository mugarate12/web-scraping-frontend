import {
  Dispatch,
  SetStateAction
} from 'react'

import api from './../config/axios'

interface createServiceResponse {
  message: string
}

export default function useServicesOperations(updateServices?: Dispatch<SetStateAction<boolean>>) {
  function updateInterface() {
    if (!!updateServices) {
      updateServices(true)
    }
  }

  async function createService(serviceName: string, time: number) {
    if (!!serviceName && serviceName.length > 0 && !!time) {
      await api.post('/services', {
        serviceName,
        updateTime: time
      })
        .then(() => {
          alert('serviço irá começar a ser monitorado')
        })
        .catch((error) => {
          alert('algum erro inexperado aconteceu, por favor, tente novamente')
        })
    }
  }

  async function updateService(id: number, time: number) {
    return await api.put(`/services/${id}`, {
      updateTime: time
    })
      .then((r) => {
        return true
      })
      .catch(error => {
        alert('atualização não foi possível, por favor, tente novamente')
      
        return false
      })
  }

  async function updateServiceAble(id: number, able: number) {
    return await api.put(`/services/${id}`, {
      able: able
    })
      .then(() => {
        updateInterface()
        return true
      })
      .catch(error => {
        alert('atualização não foi possível, por favor, tente novamente')
      
        return false
      })
  }

  async function updateServiceInformations(serviceName: string) {
    return await api.get(`/service/${serviceName}`)
      .then(() => {
        return true
      })
      .catch((error) => {
        alert('algum erro inexperado aconteceu, por favor, tente novamente')
      
        return false
      })
  }

  async function removeService(id: number) {
    return await api.delete(`/services/${id}`)
      .then(() => {
        return true
      })
      .catch(error => {
        alert('não foi possível remover o serviço, por favor, tente novamente')

        return false
      })
  }

  return {
    createService,
    updateService,
    updateServiceAble,
    updateServiceInformations,
    removeService
  }
}