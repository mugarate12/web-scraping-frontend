import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'
import moment from 'moment'

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

interface Params {
  update?: boolean,
  setUpdate?: Dispatch<SetStateAction<boolean>>
}

export default function useServicesUpdateTime({ update, setUpdate }: Params) {
  const [ updateTime, setUpdateTime ] = useState<Array<servicesUpdateTimeInterface>>([])

  async function getServicesUpdateTime() {
    const token = localStorage.getItem('userToken')

    await api.get<getServicesUpdateTimeInterface>('/services/updateTime', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data.data)
        console.log(moment().format('YYYY-MM-DD HH:mm:ss'))

        setUpdateTime(response.data.data)

        if (!!setUpdate) {
          setUpdate(false)
        }
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
    if (update) {
      getServicesUpdateTime()
    }
  }, [ update ])

  useEffect(() => {
    socket.on('routines_update_time', (servicesUpdateTime: Array<servicesUpdateTimeInterface>) => {
      setUpdateTime(servicesUpdateTime)
    })
  },  [ socket ])

  return updateTime
}