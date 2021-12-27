import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import {
  useAlert
} from './'


import { apiDetector } from './../config'

interface updatePayloadInterface {
  identifier?: string,
  able?: number
}

interface Params {
  setUpdateState?: Dispatch<SetStateAction<boolean>>
}

export default function usePublicAccessClientsOperations({
  setUpdateState
}: Params) {
  const alertHook = useAlert()

  function setToUpdateState() {
    if (!!setUpdateState) {
      setUpdateState(true)
    }
  }

  async function create(identifier: string) {
    const token = localStorage.getItem('userToken')

    return await apiDetector.post('/public/create', {
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

        alertHook.showAlert('erro ao criar cliente, por favor, tente novamente!', 'error')

        return false
      })
  }

  async function update(clientID: number, { able, identifier }: updatePayloadInterface) {
    const token = localStorage.getItem('userToken')
    let updatePayload: updatePayloadInterface = {}

    if (!!able) {
      updatePayload.able = able
    }

    if (!!identifier) {
      updatePayload.identifier = identifier
    }

    return await apiDetector.put(`/public/update/${clientID}`, updatePayload, {
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

        alertHook.showAlert('erro ao atualizar cliente, por favor, tente novamente!', 'error')

        return false
      })
  }

  async function remove(identifier: string) {
    const token = localStorage.getItem('userToken')

    return await apiDetector.delete(`/public/${identifier}`, {
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

        alertHook.showAlert('erro ao remover cliente, por favor, tente novamente!', 'error')

        return false
      })
  }
  
  return {
    create,
    update,
    remove
  }
}