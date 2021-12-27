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
  CircularProgress,
  Paper,
  Link
} from '@material-ui/core'

import { 
  DataGrid
} from '@mui/x-data-grid'

import {
  Timer
} from './../../components'

import {
  EditServiceModal
} from './../../containers'

import {
  useAlert,
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

interface serviceUpdatingInterface {
  id: number,
  isUpdating: boolean
}

const ViewsServices: NextPage = () => {
  const alertHook = useAlert()

  const [ updateRowData, setUpdateRowData ] = useState<UpdateRowData | undefined>(undefined)
  const [ updateRows, setUpdateRows ] = useState<boolean>(false)
  const [ showUpdateModal, setShowUpdateModal ] = useState<boolean>(false)

  const [ updateServicesUpdateTime, setUpdateServicesUpdateTime ] = useState<boolean>(false)
  
  const services = useServices({ updateState: updateRows, setUpdateState: setUpdateRows })
  const servicesOperations = useServicesOperations(setUpdateRows)
  const servicesUpdateTime = useServicesUpdateTime({ update: updateServicesUpdateTime , setUpdate: setUpdateServicesUpdateTime })
  const timeToExecuteRoutine = useTimeToExecuteRoutine(servicesUpdateTime)

  const [ isUpdating, setIsUpdating ] = useState<Array<number>>([])

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

  function handleRow(row: any) {
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
    
    setShowUpdateModal(true)
  }

  function setUpdatingSingleService(id: number) {
    let copyArray = isUpdating

    if (copyArray.includes(id)) {
      copyArray = copyArray.filter((number) => number !== id)
    } else {
      copyArray.push(id)
    }

    setIsUpdating(copyArray)
  }

  function renderUpdateServiceInformationButtonContent(id: number) {
    const isUpdatingById = isUpdating.includes(id)

    if (isUpdatingById) {
      return (
        <CircularProgress color="secondary" />
      )
    } else {
      return 'Atualizar dados'
    }
  }

  async function updateServiceInformation(id: number, serviceName: string) {
    setUpdatingSingleService(id)

    const result = await servicesOperations.updateServiceInformations(serviceName)

    setUpdatingSingleService(id)

    if (result) {
      alertHook.showAlert('cliente atualizado com sucesso!', 'success')
      alert('informações atualizadas com sucesso')
    } 
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
          // <Link href={makeServiceURL(serviceName)}>{makeServiceURL(serviceName)}</Link>
          <Button 
            variant="contained" 
            color='primary'
            onClick={() => window.open(makeServiceURL(serviceName))}
          >
            acessar site
          </Button>
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
    { 
      field: 'col5', 
      headerName: 'Status de serviço', 
      width: 150,
      renderCell: (cellValues: any) => {
        const row: any = cellValues['row']

        const time = row['col5']
        const updateTime = row['col2']

        return (
          <Timer 
            time={time}
            updateTime={updateTime}
            SetUpdate={setUpdateServicesUpdateTime}
          />
        )
      }
    },
    { 
      field: 'col6', 
      headerName: 'Ações', 
      width: 280, 
      disableClickEventBubbling: true, 
      renderCell: (cellValues: any) => {
        const row: any = cellValues['row']

        const serviceName: string = row['col1']
        const id: number = row['id']

        // const able: number = cellValues['row']['able']

        return (
          <div className={styles.actions_container}>
            <Button 
              variant="contained" 
              color='info'
              onClick={() => updateServiceInformation(id, serviceName)}
            >
              {renderUpdateServiceInformationButtonContent(id)}
            </Button>
          
            <Button 
              variant="contained" 
              color='warning'
              onClick={() => handleRow(row)}
            >
              Editar
            </Button>
          </div>
        )
      },
    },

  ]

  function renderEditServiceModal() {
    if (updateRowData !== undefined && showUpdateModal) {
      return (
        <EditServiceModal 
          id={updateRowData.id}
          serviceName={updateRowData.serviceName}
          updateTime={updateRowData.updateTime}
          able={updateRowData.able}
          setUpdateRowData={setUpdateRowData}
          setUpdateRows={setUpdateRows}
          setShowModal={setShowUpdateModal}
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
              isRowSelectable={() => false}
              isCellEditable={() => false}
              // disableSelectionOnClick={true}
              // disableColumnSelector={true}
              // disableDensitySelector={true}
              // onRowClick={(params) => handleRow(params)}
            />
          </div>
      </main>
    </>
  )
}

export default ViewsServices