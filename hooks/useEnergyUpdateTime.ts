import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch
} from 'react'

import { apiEnergy } from './../config'

interface EnergyUpdateTimeInterface {
  id: number,
  // last_execution: 2022-01-04 06:30:00,
  last_execution: string,
  cpfl_search_FK: number
}

interface getEnergyServicesUpdateTimeInterface {
  data: Array<EnergyUpdateTimeInterface>
}

interface Params {
  setUpdate?: Dispatch<SetStateAction<boolean>>,
  update?: boolean
}

export default function useEnergyUpdateTime({ update, setUpdate }: Params) {
  const [ servicesUpdateTime, setServicesUpdateTime ] = useState<Array<EnergyUpdateTimeInterface>>([])

  async function getServicesUpdateTime() {
    await apiEnergy.get<getEnergyServicesUpdateTimeInterface>('/service/cpfl/updateTime')
      .then(response => {
        console.log(response.data.data);
        setServicesUpdateTime(response.data.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getServicesUpdateTime()
  }, [])

  useEffect(() => {
    if (!!update) {
      getServicesUpdateTime()
    }
  }, [ update ])

  return servicesUpdateTime
}