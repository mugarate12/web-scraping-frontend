import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import socket from './../config/socketIO'
import api from './../config/axios'

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
    await api.get<GetServicesResponseInterface>('/services')
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
    getServices()
  }, [])

  useEffect(() => {
    if (!!updateState) {
      getServices()
    }
  }, [ updateState ])

  return services
}