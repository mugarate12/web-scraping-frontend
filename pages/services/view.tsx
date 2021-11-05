import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useEffect,
  useState
} from 'react'

import {
  Box,
  Paper
} from '@material-ui/core'

import { 
  DataGrid
} from '@mui/x-data-grid'

import {
  EditServiceModal
} from './../../components'

import {
  useServices
} from './../../hooks'

import styles from './../../styles/ViewServices.module.css'

interface UpdateRowData {
  id: number,
  serviceName: string,
  updateTime: number
}

const ViewsServices: NextPage = () => {
  const [ updateRowData, setUpdateRowData ] = useState<UpdateRowData | undefined>(undefined)
  const [ updateRows, setUpdateRows ] = useState<boolean>(false)
  
  const services = useServices({ updateState: updateRows, setUpdateState: setUpdateRows })

  function normalizeData() {
    return services.map((service) => {
      return {
        id: service.id,
        col1: service.service_name,
        col2: service.update_time
      }
    })
  }

  function handleRow(params: any) {
    const row = params['row']

    const id = row.id
    const serviceName = row.col1
    const updateTime = row.col2

    setUpdateRowData({
      id,
      serviceName,
      updateTime
    })
  }

  const rows = normalizeData()

  const columns = [
    { field: 'col1', headerName: 'Nome', width: 150 },
    { field: 'col2', headerName: 'Tempo em minutos', width: 150 },
  ]

  function renderEditServiceModal() {
    if (updateRowData !== undefined) {
      return (
        <EditServiceModal 
          id={updateRowData.id}
          serviceName={updateRowData.serviceName}
          updateTime={updateRowData.updateTime}
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
              onRowClick={(params) => handleRow(params)}
            />
          </div>
      </main>
    </>
  )
}

export default ViewsServices