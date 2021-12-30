import {
  useState,
  useEffect
} from 'react'

import { apiEnergy } from './../config'

import {
  useAlert
} from './'

interface StatesInterface {
  value: string,
  label: string
}

interface CitiesInterface {
  value: string,
  label: string
}

interface StatesResponse {
  message: string,
  data: Array<StatesInterface>
}

interface CitiesResponse {
  message: string,
  data: Array<CitiesInterface>
}

interface ParamsInterface {
  dealership: string,
  state: string,
  city: string
}

export default function useStatesAndCities({ dealership, state, city }: ParamsInterface) {
  const alertHook = useAlert()
  
  const [ states, setStates ] = useState<Array<StatesInterface>>([])
  const [ cities, setCities ] = useState<Array<CitiesInterface>>([])

  async function getStates() {
    await apiEnergy.get<StatesResponse>(`/service/cpfl/states/${dealership}`)
      .then(response => {
        setStates(response.data.data)
      })
      .catch(error => {

      })
  }
  
  async function getCities() {
    await apiEnergy.get<CitiesResponse>(`/service/cpfl/states/${dealership}/${state}/cities`)
      .then(response => {
        setCities(response.data.data)
      })
      .catch(error => {

      })
  }

  useEffect(() => {
    if (!!dealership) {
      getStates()
    }
  }, [ dealership ])
  
  useEffect(() => {
    if (!!state) {
      getCities()
    }
  }, [ state ])
  
  return {
    states,
    cities
  }
}