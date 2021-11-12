import {
  useState,
  useEffect
} from 'react'

import api from './../config/axios'
import socket from './../config/socketIO'

interface servicesUpdateTimeInterface {
  id: number,
  routine: number,
  last_execution: string
}

interface getServicesUpdateTimeInterface {
  message: string,
  data: Array<servicesUpdateTimeInterface>
}

export default function useServicesUpdateTime() {
  const [ updateTime, setUpdateTime ] = useState<Array<servicesUpdateTimeInterface>>([])

  async function getServicesUpdateTime() {
    const token = localStorage.getItem('userToken')

    await api.get<getServicesUpdateTimeInterface>('/services/updateTime', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setUpdateTime(response.data.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    const clientSideRendering = typeof window !== "undefined"

    if (clientSideRendering) {
      getServicesUpdateTime()
    }
  }, [])

  useEffect(() => {
    socket.on('routines_update_time', (servicesUpdateTime: Array<servicesUpdateTimeInterface>) => {
      setUpdateTime(servicesUpdateTime)
    })
  },  [ socket ])

  return updateTime
}