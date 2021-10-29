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
  }

  return {
    login
  }
}