import { useRouter } from 'next/router'

import { useAuthUserContext } from './../context/authUserContext'

import api from './../config/axios'

interface SessionResponse {
  token: string,
  message: string
}

export default function useAuth() {
  const { setToken } = useAuthUserContext()

  const router = useRouter()

  async function login(login: string, password: string) {
    if (!!login && !!password && login.length > 0 && password.length > 0) {
      await api.post<SessionResponse>('/session', {
        login,
        password
      })
        .then(response => {
          localStorage.setItem('userToken', response.data.token)
          setToken(response.data.token)
  
          router.push('/services/create')
        })
        .catch(error => {
          alert('verifique sua conexão com a internet ou seus dados')
        })
    } else {
      alert('preencha todos os campos, por favor')
    }
  }

  return {
    login
  }
}