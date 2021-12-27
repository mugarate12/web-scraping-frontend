import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import socket from './../config/socketIO'
import { apiDetector } from './../config'

import { Service } from './../interfaces/services'

interface GetServicesResponseInterface {
  message: string,
  services: Array<Service>
}

interface Params {
  updateState?: boolean, 
  setUpdateState: Dispatch<SetStateAction<boolean>>
}

export default function useServices({
  updateState,
  setUpdateState
}: Params) {
  const [ services, setServices ] = useState<Array<Service>>([])

  async function getServices() {
    const token = localStorage.getItem('userToken')

    await apiDetector.get<GetServicesResponseInterface>('/services', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setServices(response.data.services)

        if (!!setUpdateState) {
          setUpdateState(false)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    const clientSideRendering = typeof window !== "undefined"

    if (clientSideRendering) {
      getServices()
    }
  }, [])

  useEffect(() => {
    if (!!updateState) {
      getServices()
    }
  }, [ updateState ])

  return services
}