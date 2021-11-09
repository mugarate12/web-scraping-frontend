import {
  useState,
  useEffect
} from 'react'

import socket from './../config/socketIO'

interface servicesUpdateTimeInterface {
  id: number,
  routine: number,
  last_execution: string
}

export default function useServicesUpdateTime() {
  const [ updateTime, setUpdateTime ] = useState<Array<servicesUpdateTimeInterface>>([])

  useEffect(() => {
    socket.on('routines_update_time', (servicesUpdateTime: Array<servicesUpdateTimeInterface>) => {
      setUpdateTime(servicesUpdateTime)
    })
  }, [])

  useEffect(() => {
    socket.on('routines_update_time', (servicesUpdateTime: Array<servicesUpdateTimeInterface>) => {
      setUpdateTime(servicesUpdateTime)
    })
  },  [ socket ])

  return updateTime
}