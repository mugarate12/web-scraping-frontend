import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch
} from 'react'

import { apiEnergy } from './../config'

interface EnergyServiceInterface {
  id: number,
  state: string,
  city: string,
  // 1 is able and 2 is disable
  able: number,
  dealership: string,
  update_time: number
}

interface getEnergyServicesInterface {
  message: string,
  data: Array<EnergyServiceInterface>
}

interface Params {
  setUpdate?: Dispatch<SetStateAction<boolean>>,
  update?: boolean
}

export default function useEnergy({ update, setUpdate }: Params) {
  const [ services, setServices ] = useState<Array<EnergyServiceInterface>>([])
  
  async function getServices() {
    await apiEnergy.get<getEnergyServicesInterface>('/service/cpfl')
      .then(response => {
        setServices(response.data.data)

        if (!!setUpdate) {
          setUpdate(false)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getServices()
  }, [])

  useEffect(() => {
    if (!!update) {
      getServices()
    }
  }, [ update ])

  return services
}