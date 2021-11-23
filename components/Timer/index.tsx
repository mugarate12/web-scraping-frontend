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

  function updateTimer() {
    if (time === 'Executando') {
      setTimer(time)
    } else {
      const actualTime = moment()
      const moreTime = moment(time)
  
      const duration = moment.duration(actualTime.diff(moreTime))
  
      setTimer(`${(updateTime - 1) - duration.minutes()}:${60 - duration.seconds()}`)
    }
  }

  async function requestUpdate() {
    setLock(true)
    setTimer('Executando')

    await sleep(30000)

    SetUpdate(true)
    setLock(false)
  }

  async function verifyUpdate() {
    // if (updateTime === 1 && timer === '1:0') {
    //   await requestUpdate()
    // } else if (updateTime === 3 && timer === '3:0') {
    //   await requestUpdate()
    // } else if (updateTime === 5 && timer === '5:0') {
    //   await requestUpdate()
    // } else if (updateTime === 10 && timer === '10:0') {
    //   await requestUpdate()
    // } else if (updateTime === 15 && timer === '15:0') {
    //   await requestUpdate()
    // }
    if (timer === '0:1') {
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