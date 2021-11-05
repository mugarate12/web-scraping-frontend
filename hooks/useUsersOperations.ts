import { useAuthUserContext } from './../context/authUserContext'

import api from './../config/axios'

export default function useUsersOperations() {
  const { token } = useAuthUserContext()

  async function createUser(login: string, password: string) {
    console.log(token);
    
    if (!!login && !!password) {
      return api.post('/users', {
        login,
        password
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
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
          'Authorization': `Bearer ${token}`
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
        'Authorization': `Bearer ${token}`
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