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
      console.log(serviceUpdateTime.routine, moment(serviceUpdateTime.last_execution).milliseconds())

      return {
        updateTime: serviceUpdateTime.routine,
        time: serviceUpdateTime.last_execution
      }
    })

    setTimeToExecute(times)
  }

  async function UpdateTime() {
    let dates: routines = {
      1: { time: 60, timer: '00:60'},
      3: { time: 60, timer: '02:60' },
      5: { time: 60, timer: '04:60' }, 
      10: { time: 60, timer: '09:60' },
      15: { time: 60, timer: '14:60' }
    }

    servicesUpdateTime.forEach(service => {
      const actualDate = moment()

      if (service.routine === 1) {
        const lastExecutionMoment =  moment(service.last_execution)
        const duration = moment.duration(actualDate.diff(lastExecutionMoment))

        dates[1] = {
          time: 60,
          timer: `${duration.minutes()}:${duration.seconds()}`
        }
      }
    })

    setRoutines(dates)
    console.log(dates[1])

    // const actualTime = moment()
    // const addThreeMinutes = moment().add(3, 'minutes')

    // const duration = moment.duration(addThreeMinutes.diff(actualTime))
    // // console.log('duration', duration.minutes())
    // // console.log('duration seconds', duration.seconds())

    // await sleep(2000)
    //   .then(() => {
    //     const oneMinute = {
    //       time: routines[1].time === 0 ? 60 : routines[1].time - 1,
    //       timer: routines[1].time === 0 ? '00:60' : `00:${routines[1].time - 1}`
    //     }
    
    //     setRoutines({
    //       1: oneMinute,
    //       3: routines[3],
    //       5: routines[5],
    //       10: routines[10],
    //       15: routines[15]
    //     })

    //   })

  }

  function getUpdateTime() {
    // const actualTime = moment()
    // const timeMoreOneMinute = moment().add(1, 'minutes')

    // console.log(actualTime.format('HH:mm:ss'));
    // console.log(timeMoreOneMinute.seconds(0).format('HH:mm:ss'))
    // console.log(actualTime.format('HH:mm:ss').split(':')[2], timeMoreOneMinute.seconds(0).format('HH:mm:ss').split(':')[2])
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

  useEffect(() => {
    if (servicesUpdateTime.length > 0) {
      // UpdateTime()
    }
  }, [ servicesUpdateTime ])

  useEffect(() => {
    // console.log(routines[1])
    // UpdateTime()
  }, [ routines ])

  useEffect(() => {
    if (timeToExecute.length > 0) {
      listeningSocket(1)
      listeningSocket(3)
      listeningSocket(5)
      listeningSocket(10)
      listeningSocket(15)
    }
  }, [ timeToExecute ])

  return timeToExecute
}