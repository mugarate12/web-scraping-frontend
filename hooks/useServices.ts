import {
  useState,
  useEffect
} from 'react'

import socket from './../config/socketIO'
import api from './../config/axios'

import { Service } from './../interfaces/services'

interface GetServicesResponseInterface {
  message: string,
  services: Array<Service>
}

export default function useServices(updateState?: boolean) {
  const [ services, setServices ] = useState<Array<Service>>([])

  async function getServices() {
    await api.get<GetServicesResponseInterface>('/services')
      .then(response => {
        setServices(response.data.services)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getServices()
  }, [])

  useEffect(() => {
    if (updateState) {
      getServices()
    }
  }, [ updateState ])

  return services
}