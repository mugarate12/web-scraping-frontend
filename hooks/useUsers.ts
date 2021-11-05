import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import { useAuthUserContext } from './../context/authUserContext'

import api from './../config/axios'

interface User {
  id: number,
  login: string
}

interface getUsersResponse {
  message: string,
  users: Array<User>
}

interface Params {
  updateUsersState?: boolean,
  setUpdateUsersState?: Dispatch<SetStateAction<boolean>>
}

export default function useUsers({ updateUsersState, setUpdateUsersState }: Params) {
  const { token } = useAuthUserContext()

  const [ users, setUsers ] = useState<Array<User>>([])

  async function getUsers() {
    await api.get<getUsersResponse>('/users', {
      headers: {
        'Authentication': `Bearer ${token}`
      }
    })
      .then(response => {
        setUsers(response.data.users)

        if (!!setUpdateUsersState) {
          setUpdateUsersState(false)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    if (!!updateUsersState) {
      getUsers()
    }
  }, [ updateUsersState ])

  return users
}