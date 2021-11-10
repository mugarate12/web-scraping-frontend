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
    await api.get<getServicesUpdateTimeInterface>('/services/updateTime')
      .then(response => {
        setUpdateTime(response.data.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    // socket.on('routines_update_time', (servicesUpdateTime: Array<servicesUpdateTimeInterface>) => {
    //   setUpdateTime(servicesUpdateTime)
    // })
    getServicesUpdateTime()
  }, [])

  useEffect(() => {
    socket.on('routines_update_time', (servicesUpdateTime: Array<servicesUpdateTimeInterface>) => {
      setUpdateTime(servicesUpdateTime)
    })
  },  [ socket ])

  return updateTime
}