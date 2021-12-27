import {
  Dispatch,
  SetStateAction
} from 'react'

import {
  useAlert
} from './'

import { apiDetector } from './../config'

interface createServiceResponse {
  message: string
}

export default function useServicesOperations(updateServices?: Dispatch<SetStateAction<boolean>>) {
  const alertHook = useAlert()
  
  function updateInterface() {
    if (!!updateServices) {
      updateServices(true)
    }
  }

  async function createService(serviceName: string, time: number) {
    const token = localStorage.getItem('userToken')
    
    if (!!serviceName && serviceName.length > 0 && !!time) {
      await apiDetector.post('/services', {
        serviceName,
        updateTime: time
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(() => {
          alertHook.showAlert('serviço irá começar a ser monitorado', 'success')

          return true
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              alertHook.showAlert('você não tem autorização pra realizar essa operação', 'error')

              return false
            }
          }

          alertHook.showAlert('algum erro inexperado aconteceu, por favor, tente novamente', 'error')
          return false
        })
    }
  }

  async function updateService(id: number, time: number) {
    const token = localStorage.getItem('userToken')

    return await apiDetector.put(`/services/${id}`, {
      updateTime: time
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((r) => {
        return true
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            alertHook.showAlert('você não tem autorização pra realizar essa operação', 'error')

            return false
          }
        }

        alertHook.showAlert('atualização não foi possível, por favor, tente novamente', 'error')
      
        return false
      })
  }

  async function updateServiceAble(id: number, able: number) {
    const token = localStorage.getItem('userToken')
    
    return await apiDetector.put(`/services/${id}`, {
      able: able
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        updateInterface()
        return true
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            alertHook.showAlert('você não tem autorização pra realizar essa operação', 'error')

            return false
          }
        }

        alertHook.showAlert('atualização não foi possível, por favor, tente novamente', 'error')
      
        return false
      })
  }

  async function updateServiceInformations(serviceName: string) {
    const token = localStorage.getItem('userToken')
    
    return await apiDetector.get(`/service/${serviceName}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        return true
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            alertHook.showAlert('você não tem autorização pra realizar essa operação', 'error')

            return false
          }
        }

        alertHook.showAlert('algum erro inexperado aconteceu, por favor, tente novamente', 'error')
      
        return false
      })
  }

  async function removeService(id: number) {
    const token = localStorage.getItem('userToken')
    
    return await apiDetector.delete(`/services/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        return true
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            alertHook.showAlert('você não tem autorização pra realizar essa operação', 'error')

            return false
          }
        }
        
        alertHook.showAlert('não foi possível remover o serviço, por favor, tente novamente', 'error')

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