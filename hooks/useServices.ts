import {
  useState,
  useEffect
} from 'react'

import socket from './../config/socketIO'

export default function useServices() {
  const [ services, setServices ] = useState<Array<any>>([])

  useEffect(() => {
    socket.on('monitoring-services', (monitoring: any) => {
      // setar nos services
      setServices(monitoring)
    })
  }, [ socket ])

  useEffect(() => {
    socket.on('monitoring-updated', (monitoring: any) => {
      console.log('serviço atualizado', monitoring)

      monitoring.forEach((monitored: any) => {
        console.log(JSON.parse(monitored.content))
      })
    })
  }, [])

  return services
}