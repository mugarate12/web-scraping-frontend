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
  data: Array<string>
}

interface CitiesResponse {
  message: string,
  data: Array<CitiesInterface>
}

interface ParamsInterface {
  state: string,
  city: string
}

export default function useStatesAndCities({ state, city }: ParamsInterface) {
  const alertHook = useAlert()
  
  const [ states, setStates ] = useState<Array<StatesInterface>>([])
  const [ cities, setCities ] = useState<Array<CitiesInterface>>([])

  function formatStatesResponse(states: Array<string>) {
    return states.map((state) => {
      return {
        label: state,
        value: state
      }
    })
  }

  async function getStates() {
    await apiEnergy.get<StatesResponse>('/service/cpfl/states')
      .then(response => {
        setStates(formatStatesResponse(response.data.data))
      })
      .catch(error => {

      })
  }
  
  async function getCities() {
    await apiEnergy.get<CitiesResponse>(`/service/cpfl/states/${state}/cities`)
      .then(response => {
        setCities(response.data.data)
      })
      .catch(error => {

      })
  }

  useEffect(() => {
    getStates()
  }, [])
  
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