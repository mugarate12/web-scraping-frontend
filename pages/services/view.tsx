import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useEffect,
  useState
} from 'react'
import moment from 'moment'
import 'moment/locale/pt-br'

import {
  Box,
  Button,
  Paper,
  Link
} from '@material-ui/core'

import { 
  DataGrid
} from '@mui/x-data-grid'

import {
  EditServiceModal
} from './../../components'

import {
  useServices,
  useServicesOperations,
  useServicesUpdateTime,
  useTimeToExecuteRoutine
} from './../../hooks'

import { Service } from './../../interfaces/services'

import styles from './../../styles/ViewServices.module.css'

interface UpdateRowData {
  id: number,
  serviceName: string,
  updateTime: number,
  able: number
}

const ViewsServices: NextPage = () => {
  const [ updateRowData, setUpdateRowData ] = useState<UpdateRowData | undefined>(undefined)
  const [ updateRows, setUpdateRows ] = useState<boolean>(false)
  
  const services = useServices({ updateState: updateRows, setUpdateState: setUpdateRows })
  const servicesOperations = useServicesOperations(setUpdateRows)
  const servicesUpdateTime = useServicesUpdateTime()
  const timeToExecuteRoutine = useTimeToExecuteRoutine(servicesUpdateTime)

  function makeServiceURL(serviceName: string) {
    const url = `https://downdetector.com/status/${serviceName}`

    return url
  }

  function renderServiceAbleText(able: number) {
    if (able === 1) {
      return 'Habilitado'
    } else {
      return 'Desabilitado'
    }
  }

  function returnServiceAbleColorType(able: number) {
    if (able === 1) {
      return 'success'
    } else {
      return 'error'
    }
  }

  async function serviceAbleOnClick(id: number, able: number) {
    if (able === 1) {
      await servicesOperations.updateServiceAble(id, 2)
    } else {
      await servicesOperations.updateServiceAble(id, 1)
    }
  }

  function getTime(service: Service) {
    let time = ''

    timeToExecuteRoutine.forEach((timeToExecute) => {
      if (service.update_time === timeToExecute.updateTime) {
        time = timeToExecute.time
      }
    })

    return time
  }

  function normalizeData() {
    return services.map((service) => {
      return {
        id: service.id,
        col1: service.service_name,
        col2: service.update_time,
        col5: getTime(service),
        able: service.habilitado
      }
    })
  }

  function handleRow(params: any) {
    const row = params['row']

    const id = row.id
    const serviceName = row.col1
    const updateTime = row.col2
    const able = row.able

    setUpdateRowData({
      id,
      serviceName,
      updateTime,
      able
    })
  }

  const rows = normalizeData()

  const columns = [
    { field: 'col1', headerName: 'Nome', width: 150 },
    { field: 'col2', headerName: 'Tempo em minutos', width: 150 },
    { 
      field: 'col3', 
      headerName: 'Link', 
      width: 150, 
      disableClickEventBubbling: true, 
      renderCell: (cellValues: any) => {
        const serviceName: string = cellValues['row']['col1']

        return (
          <Link href={makeServiceURL(serviceName)}>{makeServiceURL(serviceName)}</Link>
        )
      },
    },
    { 
      field: 'col4', 
      headerName: 'Serviço', 
      width: 150, 
      disableClickEventBubbling: true, 
      renderCell: (cellValues: any) => {
        const id: number = cellValues['row']['id']
        const able: number = cellValues['row']['able']

        return (
          <Button 
            variant="contained" 
            color={returnServiceAbleColorType(able)}
            onClick={() => serviceAbleOnClick(id, able)}
          >
            {renderServiceAbleText(able)}
          </Button>
        )
      },
    },
    { field: 'col5', headerName: 'Status de serviço', width: 150 },
  ]

  function renderEditServiceModal() {
    if (updateRowData !== undefined) {
      return (
        <EditServiceModal 
          id={updateRowData.id}
          serviceName={updateRowData.serviceName}
          updateTime={updateRowData.updateTime}
          able={updateRowData.able}
          setUpdateRowData={setUpdateRowData}
          setUpdateRows={setUpdateRows}
        />
      )
    }
  }

  return (
    <>
      <Head>
        <title>Visualizar serviços</title>
      </Head>

      {renderEditServiceModal()}

      <main className={styles.container}>
          <div style={{ 
            height: '100%', 
            width: '100%',
            padding: '20px 30px'
          }}>
            <DataGrid 
              rows={rows} 
              columns={columns}
              // onRowClick={(params) => handleRow(params)}
            />
          </div>
      </main>
    </>
  )
}

export default ViewsServices