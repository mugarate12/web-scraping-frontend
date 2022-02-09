import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch
} from 'react'

import { apiEnergy } from './../config'

interface hostsPerfilInterface {
  id: number,
  name: string,

  user: string,
  password: string,
  url: string,
  worksheet_link: string
}

interface getHostsPerfisInterface {
  data: Array<hostsPerfilInterface>
}

interface Params {
  setUpdate?: Dispatch<SetStateAction<boolean>>,
  update?: boolean
}

export default function useHostsPerfis({ update, setUpdate }: Params) {
  const [ perfis, setPerfis ] = useState<Array<hostsPerfilInterface>>([])

  async function getPerfis() {
    await apiEnergy.get<getHostsPerfisInterface>('/hostperfil')
      .then((response) => {
        setPerfis(response.data.data)

        if (!!setUpdate) {
          setUpdate(false)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getPerfis()
  }, [])

  useEffect(() => {
    if (!!update) {
      getPerfis()
    }
  }, [ update ])

  return perfis
} 