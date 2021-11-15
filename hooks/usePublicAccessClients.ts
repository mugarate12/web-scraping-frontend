import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

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

  async function getClients() {
    const token = localStorage.getItem('userToken')

    await api.get<getClientsInterface>('/public', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setClients(response.data.data)
      })
      .catch(error => {
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