// /service/cpfl/client/access/:dealership/:state/:clientKe

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
  data: Array<EnergyServiceInterface>
}

interface Params {
  dealership: string,
  state: string,
  clientKey: string
}

export default function useCitiesOfClientKeyHavePermission({ dealership, state, clientKey }: Params) {
  const [ services, setServices ] = useState<Array<EnergyServiceInterface>>([])
  
  async function getEnergyServices() {
    await apiEnergy.get<getEnergyServicesInterface>(`/service/cpfl/client/access/:dealership/:state/:clientKe`)
      .then((response) => {
        setServices(response.data.data)
      })
      .catch(error => console.log(error))
      
  }

  useEffect(() => {
    getEnergyServices()
  }, [])

  useEffect(() => {
    if (!!dealership && !!state && !!clientKey) {
      console.log('tentei')
      getEnergyServices()
    }
  }, [ dealership, state, clientKey ])

  return services
}