import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch
} from 'react'

import { apiEnergy } from '../config'

interface serviceInterface {
  id: number,
  pix_name: string,
  state: string,
  city: string,
  able: number
}

interface getServicesInterface {
  services: Array<serviceInterface>
}

interface Params {
  update?: boolean,
  setUpdate?: Dispatch<SetStateAction<boolean>>
}

export default function useOCRServices({ update, setUpdate }: Params) {
  const [ services, setServices ] = useState<Array<serviceInterface>>([])

  async function getServices() {
    await apiEnergy.get<getServicesInterface>('/ocr/registred/all')
      .then(response => {
        setServices(response.data.services)

        if (!!setUpdate) {
          setUpdate(false)
        }
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