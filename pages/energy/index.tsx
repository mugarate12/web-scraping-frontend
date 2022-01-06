import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useState
} from 'react'

import {
  Timer
} from './../../components'

import {
  EditEnergyModal
} from './../../containers'

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
  useEnergy,
  useEnergyOperations,
  useEnergyUpdateTime
} from './../../hooks'

import styles from './../../styles/ViewEnergyServices.module.css'

interface EnergyUpdate {
  id: number,
  title: string,
  updateTime: number
}

const ViewEnergyPage: NextPage = () => {
  const [ updateServices, setUpdateServices ] = useState<boolean>(false)
  const [ updateServicesUpdateTime, setUpdateServicesUpdateTime ] = useState<boolean>(false)
  const [ showUpdateModal, setShowUpdateModal ] = useState<boolean>(false)

  const [ serviceToUpdate, setServiceToUpdate ] = useState<EnergyUpdate>()
  
  const services = useEnergy({ update: updateServices, setUpdate: setUpdateServices })
  const servicesUpdateTime = useEnergyUpdateTime({ update: updateServicesUpdateTime, setUpdate: setUpdateServicesUpdateTime })
  const energyOperations = useEnergyOperations({ setUpdate: setUpdateServices })

  const [ isUpdating, setIsUpdating ] = useState<Array<number>>([])

  function getServiceTime(id: number) {
    let time = ''

    servicesUpdateTime.forEach((serviceUpdateTime) => {
      if (serviceUpdateTime.cpfl_search_FK === id) {
        time = serviceUpdateTime.last_execution
      }
    })

    return time
  }

  function normalizeServicesData() {
    return services.map((service) => {
      return {
        id: service.id,
        col1: service.dealership,
        col2: `${service.state}/${service.city}`,
        col3: service.update_time,
        able: service.able,
        time: getServiceTime(service.id)
      }
    })
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
      await energyOperations.update({ id, able: 2 })
    } else {
      await energyOperations.update({ id, able: 1 })
    }
  }

  function renderServiceAbleText(able: number) {
    if (able === 1) {
      return 'Habilitado'
    } else {
      return 'Desabilitado'
    }
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

  function setUpdatingSingleService(id: number) {
    let copyArray = isUpdating

    if (copyArray.includes(id)) {
      copyArray = copyArray.filter((number) => number !== id)
    } else {
      copyArray.push(id)
    }

    setIsUpdating(copyArray)
  }

  async function updateServiceInformation(id: number, state: string, city: string) {
    setUpdatingSingleService(id)

    await energyOperations.updateManually(state, city)

    setUpdatingSingleService(id)
  }

  function showModal() {
    if (showUpdateModal && !!serviceToUpdate) {
      return (
        <EditEnergyModal
          id={serviceToUpdate.id}
          title={serviceToUpdate.title}
          updateTime={serviceToUpdate.updateTime}
          setUpdateServices={setUpdateServices}
          setViewModal={setShowUpdateModal}
        />
      )
    }
  }

  function updapeService(id: number, stateAndCity: string, updateTime: number) {
    setServiceToUpdate({ id, title: stateAndCity, updateTime })
    setShowUpdateModal(true)
  }

  const columns = [
    { field: 'col1', headerName: 'Cessionária', width: 150 },
    { field: 'col2', headerName: 'Estado/Cidade', width: 250 },
    { field: 'col3', headerName: 'Tempo em minutos', width: 150 },
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

        const time = row['time']
        const updateTime = row['col3']

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

        const stateAndCity = row['col2'].split('/')
        const state: string = stateAndCity[0]
        const city: string = stateAndCity[1]
        const id: number = row['id']

        const modalTitle: string =  row['col2']
        const updateTime: number = row['col3']

        return (
          <div className={styles.actions_container}>
            <Button 
              variant="contained" 
              color='info'
              onClick={() => updateServiceInformation(id, state, city)}
            >
              {renderUpdateServiceInformationButtonContent(id)}
            </Button>
          
            <Button 
              variant="contained" 
              color='warning'
              sx={{
                marginLeft: '5px'
              }}
              onClick={() => updapeService(id, modalTitle, updateTime)}
            >
              Editar
            </Button>
          </div>
        )
      },
    },
  ]

  const rows = normalizeServicesData()

  return (
    <>
      <Head>
        <title>Ver serviços</title>
      </Head>

      {showModal()}

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

export default ViewEnergyPage