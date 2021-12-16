import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'
import moment from 'moment'

interface Props {
  time: string,
  updateTime: number,
  SetUpdate: Dispatch<SetStateAction<boolean>>
}

export default function Timer({
  time,
  updateTime,
  SetUpdate
}: Props) {
  const [ timer, setTimer ] = useState<string>('')
  const [ lock, setLock ] = useState<boolean>(false)

  function sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  function createTwoDigitsNumber(number: number) {
    if (number < 10) {
      return `0${number}`
    } else {
      return `${number}`
    }
  }

  function formatDate(time: string) {
    const actualTime = moment()
    const moreTime = moment(time)

    const duration = moment.duration(actualTime.diff(moreTime))
    const minutes = ((updateTime - 1) - duration.minutes()) === 0 ? '00' : createTwoDigitsNumber((updateTime - 1) - duration.minutes())
    const seconds = (60 - duration.seconds()) === 0 ? '00' : createTwoDigitsNumber(60 - duration.seconds())

    return `00:${minutes}:${seconds}`
  }

  async function updateTimer() {
    if (time === 'Executando') {
      setTimer(time)
    } else if (formatDate(time).includes('-')) {
      setTimer('Executando')

      await sleep(2000)

      SetUpdate(true)
    } else {
      // const actualTime = moment()
      // const moreTime = moment(time)
  
      // const duration = moment.duration(actualTime.diff(moreTime))
      // const minutes = ((updateTime - 1) - duration.minutes()) === 0 ? '00' : createTwoDigitsNumber((updateTime - 1) - duration.minutes())
      // const seconds = (60 - duration.seconds()) === 0 ? '00' : createTwoDigitsNumber(60 - duration.seconds())
  
      setTimer(formatDate(time))
    }
  }

  async function requestUpdate() {
    setLock(true)
    setTimer('Executando')

    await sleep(20000)

    setLock(false)
  }

  async function verifyUpdate() {
    if (timer === '00:00:01') {
      await requestUpdate()
    }
  }

  useEffect(() => {
    if (lock === false) {
      const interval = setInterval(() => {
        updateTimer()
      }, 1000)
  
      return () => clearInterval(interval)
    }
  }, [ time, lock ])

  useEffect(() => {
    verifyUpdate()
  }, [ timer ])

  return (
    <p>{timer}</p>
  )
}