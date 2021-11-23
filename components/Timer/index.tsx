import {
  useState,
  useEffect
} from 'react'
import moment from 'moment'

interface Props {
  time: string,
  updateTime: number
}

export default function Timer({
  time,
  updateTime
}: Props) {
  const [ timer, setTimer ] = useState<string>('')

  function updateTimer() {
    const actualTime = moment()
    const moreTime = moment(time)

    const duration = moment.duration(actualTime.diff(moreTime))
    // console.log(`${duration.minutes}:${duration.seconds()}`);

    setTimer(`${duration.minutes()}:${duration.seconds()}`)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateTimer()
    }, 1000)

    return () => clearInterval(interval)
  }, [  ])

  return (
    <p>{timer}</p>
  )
}