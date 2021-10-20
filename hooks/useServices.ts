import {
  useState,
  useEffect
} from 'react'

import socket from './../config/socketIO'

import { Service } from './../interfaces/services'

export default function useServices() {
  const [ services, setServices ] = useState<Array<Service>>([])

  function convertToJSON(monitored: any) {
    return monitored.map((service: any) => {
      return {
        name: service.name,
        content:  JSON.parse(service.content)
      }
    })
  }

  useEffect(() => {
    socket.on('monitoring-services', (monitored: any) => {
      // const data = monitored.map((s: any) => {
      //   console.log(JSON.parse(s.content));
      // })
      const data = convertToJSON(monitored)
      setServices(data)
    })
  }, [ socket ])

  useEffect(() => {
    socket.on('monitoring-updated', (monitored: any) => {
      const data = convertToJSON(monitored)
      setServices(data)
    })
  }, [])

  return services
}