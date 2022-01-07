import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch
} from 'react'

import { apiEnergy } from './../config'

interface ServiceInterface {
  // ENERGY DATA
  id: number,
  cpfl_search_FK: number,
  client_FK: number,

  // CPFL SEARCH DATA
  state: string,
  city: string,
  // 1 is able and 2 is disable
  able: number,
  dealership: string,
  update_time: number,

  // CLIENT DATA
  identifier: string,
  expiration_time: string
}

interface getServicesInterface {
  message: string,
  data: Array<ServiceInterface>
}

interface Params {
  setUpdate?: Dispatch<SetStateAction<boolean>>,
  update?: boolean
}

export default function useEnergyWithClients({ update, setUpdate }: Params) {
  const [ services, setServices] = useState<Array<ServiceInterface>>([])

  async function getServices() {
    const token = localStorage.getItem('userToken')

    await apiEnergy.get<getServicesInterface>('/service/cpfl/servicesPerClients', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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