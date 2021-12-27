import { useAuthUserContext } from './../context/authUserContext'

import {
  useAlert
} from './'

import { apiDetector } from './../config'

interface updateUserPayload {
  password?: string,
  isAdmin?: boolean
}

export default function useUsersOperations() {
  const alertHook = useAlert()

  async function createUser(login: string, password: string, isAdmin: boolean) {
    const token = localStorage.getItem('userToken')
    
    if (!!login && !!password) {
      return apiDetector.post('/users', {
        login,
        password,
        isAdmin
      }, {
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

          alertHook.showAlert('não foi possível criar usuário, por favor, tente novamente', 'error')
          console.log(error)
          return false
        })
    }

  }

  async function updateUser(id: number, payload: updateUserPayload) {
    const token = localStorage.getItem('userToken')

    return apiDetector.put(`/users/${id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(() => {
        alertHook.showAlert('usuário atualizado com sucesso!', 'success')

        return true
      })
      .catch(error => {
        alertHook.showAlert('usuário não foi atualizado, por favor, tente novamente', 'error')
        console.log(error)
        
        return false
      })
  }

  async function removeUser(id: number) {
    const token = localStorage.getItem('userToken')
    
    return apiDetector.delete(`/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        alertHook.showAlert('usuário deletado com sucesso!', 'success')

        return true
      })
      .catch(error => {
        alertHook.showAlert('usuário não foi deletado, por favor, tente novamente', 'error')
        // console.error(error)
        console.log(error.response)

        return false
      })
  }

  return {
    createUser,
    updateUser,
    removeUser
  }
}