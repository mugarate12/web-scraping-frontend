import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import api from './../config/axios'

interface Params {
  setUpdateState?: Dispatch<SetStateAction<boolean>>
}

export default function usePublicAccessClientsOperations({
  setUpdateState
}: Params) {
  function setToUpdateState() {
    if (!!setUpdateState) {
      setUpdateState(true)
    }
  }

  async function create(identifier: string) {
    const token = localStorage.getItem('userToken')

    return await api.post('/public/create', {
      identifier
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setToUpdateState()

        return true
      })
      .catch(error => {
        console.log(error)

        alert('erro ao criar cliente, por favor, tente novamente!')

        return false
      })
  }

  async function remove(identifier: string) {
    const token = localStorage.getItem('userToken')

    return await api.delete(`/public/${identifier}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setToUpdateState()

        return true
      })
      .catch(error => {
        console.log(error)

        alert('erro ao remover cliente, por favor, tente novamente!')

        return false
      })
  }
  
  return {
    create,
    remove
  }
}