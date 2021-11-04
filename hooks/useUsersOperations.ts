import { useAuthUserContext } from './../context/authUserContext'

import api from './../config/axios'

export default function useUsersOperations() {
  const { token } = useAuthUserContext()

  async function createUser(login: string, password: string) {
    if (!!login && !!password) {
      return api.post('/users', {
        login,
        password
      }, {
        headers: {
          'Authentication': `Bearer ${token}`
        }
      })
        .then(() => {
          return true
        })
        .catch(error => {
          alert('não foi possível criar usuário, por favor, tente novamente')
          console.log(error)
          return false
        })
    }

  }

  async function updateUser(id: number, password: string) {
    return api.put(`/users/${id}`, {
      password
      }, {
        headers: {
          'Authentication': `Bearer ${token}`
        }
      })
      .then(() => {
        return true
      })
      .catch(error => {
        alert('usuário não foi atualizado, por favor, tente novamente')
        console.log(error)
        return false
      })
  }

  async function removeUser(id: number) {
    return api.delete(`/users/${id}`, {
      headers: {
        'Authentication': `Bearer ${token}`
      }
    })
      .then(() => {
        return true
      })
      .catch(error => {
        alert('usuário não foi deletado, por favor, tente novamente')
        console.log(error)
        return false
      })
  }

  return {
    createUser,
    updateUser,
    removeUser
  }
}