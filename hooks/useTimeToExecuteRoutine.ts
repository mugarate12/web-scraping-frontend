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

interface routines {
  1: { time: number, timer: string },
  3: { time: number, timer: string },
  5: { time: number, timer: string }, 
  10: { time: number, timer: string },
  15: { time: number, timer: string }
}

export default function useTimeToExecuteRoutine(servicesUpdateTime: Array<servicesUpdateTimeInterface>) {
  const [ timeToExecute, setTimeToExecute ] = useState<Array<timeToExecuteInterface>>([])
  const [ dateDuration, setDuration ] = useState<string>('')
  const [ routines, setRoutines ] = useState<routines>({
    1: { time: 60, timer: '00:60'},
    3: { time: 60, timer: '02:60' },
    5: { time: 60, timer: '04:60' }, 
    10: { time: 60, timer: '09:60' },
    15: { time: 60, timer: '14:60' }
  }) 

  function sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  function getTime() {
    moment.locale('pt-br')

    const actualTime = moment()
    
    const times = servicesUpdateTime.map((serviceUpdateTime) => {
      console.log(serviceUpdateTime.routine, serviceUpdateTime.last_execution)

      return {
        updateTime: serviceUpdateTime.routine,
        time: serviceUpdateTime.last_execution
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

      setTimeToExecute(times)
    })
  }

  useEffect(() => {
    getTime()
  }, [ servicesUpdateTime ])


  // useEffect(() => {
  //   if (timeToExecute.length > 0) {
  //     listeningSocket(1)
  //     listeningSocket(3)
  //     listeningSocket(5)
  //     listeningSocket(10)
  //     listeningSocket(15)
  //   }
  // }, [ timeToExecute ])

  return timeToExecute
}