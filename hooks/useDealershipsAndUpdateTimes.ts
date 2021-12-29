import {
  useState,
  useEffect
} from 'react'

import { apiEnergy } from './../config'

interface DealershipInterface {
  label: string,
  value: string
}

interface UpdatesTimesInterface {
  label: string,
  value: number
}

interface UpdatesTimesStateInterface {
  label: string,
  value: string
}

interface DealershipResponseInterface {
  data: Array<DealershipInterface>
}

interface UpdatesTimesResponseInterface {
  data: Array<UpdatesTimesInterface>
}

export default function useDealershipsAndUpdateTimes() {
  const [ dealerships, setDealerships ] = useState<Array<DealershipInterface>>([])
  const [ updatesTimes, setUpdatesTimes ] = useState<Array<UpdatesTimesStateInterface>>([])

  async function getDealerships() {
    await apiEnergy.get<DealershipResponseInterface>('/service/cpfl/dealerships')
      .then(response => {
        setDealerships(response.data.data)
      })
      .catch(error => {

      })
  }
  
  async function getUpdatesTimes() {
    await apiEnergy.get<UpdatesTimesResponseInterface>('/service/cpfl/updatesTimes')
      .then(response => {
        console.log(response.data.data);

        const formattedData = response.data.data.map((updateTime) => {
          return {
            ...updateTime,
            value: String(updateTime.value)
          }
        })

        console.log(formattedData);

        setUpdatesTimes(formattedData)
      })
      .catch(error => {

      })
  }

  useEffect(() => {
    getDealerships()
  }, [  ])
  
  useEffect(() => {
    getUpdatesTimes()
  }, [  ])

  return {
    dealerships,
    updatesTimes
  }
}