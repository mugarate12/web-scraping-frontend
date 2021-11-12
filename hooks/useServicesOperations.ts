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
    const token = localStorage.getItem('userToken')
    
    if (!!serviceName && serviceName.length > 0 && !!time) {
      await api.post('/services', {
        serviceName,
        updateTime: time
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(() => {
          alert('serviço irá começar a ser monitorado')
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              alert('você não tem autorização pra realizar essa operação')

              return 
            }
          }

          alert('algum erro inexperado aconteceu, por favor, tente novamente')
        })
    }
  }

  async function updateService(id: number, time: number) {
    const token = localStorage.getItem('userToken')

    return await api.put(`/services/${id}`, {
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
            alert('você não tem autorização pra realizar essa operação')

            return false
          }
        }

        alert('atualização não foi possível, por favor, tente novamente')
      
        return false
      })
  }

  async function updateServiceAble(id: number, able: number) {
    const token = localStorage.getItem('userToken')
    
    return await api.put(`/services/${id}`, {
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
            alert('você não tem autorização pra realizar essa operação')

            return false
          }
        }

        alert('atualização não foi possível, por favor, tente novamente')
      
        return false
      })
  }

  async function updateServiceInformations(serviceName: string) {
    const token = localStorage.getItem('userToken')
    
    return await api.get(`/service/${serviceName}`, {
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
            alert('você não tem autorização pra realizar essa operação')

            return false
          }
        }

        alert('algum erro inexperado aconteceu, por favor, tente novamente')
      
        return false
      })
  }

  async function removeService(id: number) {
    const token = localStorage.getItem('userToken')
    
    return await api.delete(`/services/${id}`, {
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
            alert('você não tem autorização pra realizar essa operação')

            return false
          }
        }
        
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