import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import {
  useAlert
} from './'

import api from './../config/axios'

import { clientInformationData } from './../interfaces/publicAccessClients'

interface getClientsInterface {
  data: Array<clientInformationData>
}

interface Params {
  updateState?: boolean, 
  setUpdateState?: Dispatch<SetStateAction<boolean>>
}

export default function usePublicAccessClients({
  updateState,
  setUpdateState
}: Params) {
  const [ clients, setClients ] = useState<Array<clientInformationData>>([])

  const alertHook = useAlert()

  async function getClients() {
    const token = localStorage.getItem('userToken')

    await api.get<getClientsInterface>('/public', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data.data);
        setClients(response.data.data)
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            alertHook.showAlert('você não tem autorização pra realizar essa operação', 'error')

            return 
          }
        }

        console.log(error)
      })
  }

  useEffect(() => {
    const clientSideRendering = typeof window !== "undefined"

    if (clientSideRendering) {
      getClients()
    }
  }, [])

  useEffect(() => {
    if (!!updateState) {
      getClients()
    }
  }, [ updateState ])

  return clients
}