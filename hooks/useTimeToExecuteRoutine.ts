import { 
  useState,
  useEffect
} from 'react'
import moment from 'moment'
import 'moment/locale/pt-br'

import socket from './../config/socketIO'

interface servicesUpdateTimeInterface {
  id: number,
  routine: number,
  last_execution: string
}

interface timeToExecuteInterface {
  time: string,
  updateTime: number
}

export default function useTimeToExecuteRoutine(servicesUpdateTime: Array<servicesUpdateTimeInterface>) {
  const [ timeToExecute, setTimeToExecute ] = useState<Array<timeToExecuteInterface>>([])

  function getTime() {
    moment.locale('pt-br')

    const actualTime = moment()
    
    const times = servicesUpdateTime.map((serviceUpdateTime) => {
      return {
        updateTime: serviceUpdateTime.routine,
        time: actualTime.to(moment(serviceUpdateTime.last_execution).add(serviceUpdateTime.routine, 'minutes'))
      }
    })

    setTimeToExecute(times)
  }

  function listeningSocket(updateTime: number) {
    socket.on(`routine_${updateTime}`, () => {
      moment.locale('pt-br')

      const actualTime = moment()

      const copy = timeToExecute

      const times = copy.map((time) => {
        if (time.updateTime === updateTime) {
          return {
            time: 'Executando',
            updateTime: time.updateTime
          } 
        } else {
          return {
            updateTime: time.updateTime,
            time: time.time
          }
        }
      })

      console.log(times)
      setTimeToExecute(times)
    })
  }

  useEffect(() => {
    getTime()
  }, [ servicesUpdateTime ])

  useEffect(() => {
    listeningSocket(1)
    listeningSocket(3)
    listeningSocket(5)
    listeningSocket(10)
    listeningSocket(15)
  }, [])

  // useEffect(() => {
  //   socket.on('routines_update_time', (servicesUpdateTime: Array<servicesUpdateTimeInterface>) => {
  //     getTime()
  //   })
  // }, [])

  return timeToExecute
}