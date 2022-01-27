import {
  useState,
  useEffect
} from 'react'

import { apiDetector } from './../config'

interface StatesInterface {
  value: string,
  label: string
}

interface CitiesInterface {
  value: string,
  label: string
}

interface ServicesInterface {
  value: string,
  label: string
}

interface StatesResponse {
  states: Array<StatesInterface>
}

interface CitiesResponse {
  cities: Array<CitiesInterface>
}

interface ServicesResponse {
  services: Array<CitiesInterface>
}

interface Params {
  state: string,
  city: string
}

export default function useOCRRegistredServices({ state, city }: Params) {
  const [ states, setStates ] = useState<Array<StatesInterface>>([])
  const [ cities, setCities ] = useState<Array<CitiesInterface>>([])
  const [ services, setServices ] = useState<Array<ServicesInterface>>([])

  async function getStates() {
    await apiDetector.get<StatesResponse>('/ocr/registred/states')
      .then(response => {
        setStates(response.data.states)
      })
      .catch(error => {

      })
  }

  async function getCities() {
    await apiDetector.get<CitiesResponse>(`/ocr/registred/${state}/cities`)
      .then(response => {
        setCities(response.data.cities)
      })
      .catch(error => {

      })
  }
  
  async function getServices() {
    console.log('renderOcrServices', `/ocr/registred/${state}/${city}/services`);
    await apiDetector.get<ServicesResponse>(`/ocr/registred/${state}/${city}/services`)
      .then(response => {
        setServices(response.data.services)
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

  useEffect(() => {
    if (!!city) {
      getServices()
    }
  }, [ city ])

  return {
    states,
    cities,
    services
  }
}