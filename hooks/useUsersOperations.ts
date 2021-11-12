import { useAuthUserContext } from './../context/authUserContext'

import api from './../config/axios'

export default function useUsersOperations() {
  async function createUser(login: string, password: string, isAdmin: boolean) {
    const token = localStorage.getItem('userToken')
    
    if (!!login && !!password) {
      return api.post('/users', {
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
              alert('você não tem autorização pra realizar essa operação')

              return false
            }
          } 

          
          alert('não foi possível criar usuário, por favor, tente novamente')
          console.log(error)
          return false
        })
    }

  }

  async function updateUser(id: number, password: string) {
    const token = localStorage.getItem('userToken')

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
    const token = localStorage.getItem('userToken')
    
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