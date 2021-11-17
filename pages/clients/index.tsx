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
  IconButton,
  Paper,
  Link
} from '@material-ui/core'

import { 
  DataGrid
} from '@mui/x-data-grid'

import {
  FileCopy
} from '@material-ui/icons'

import {
  EditClientModal
} from './../../components'

import {
  useAlert,
  usePublicAccessClients,
  usePublicAccessClientsOperations,
  useServices,
  useServicesOperations,
  useServicesUpdateTime,
  useTimeToExecuteRoutine
} from './../../hooks'

import { Service } from './../../interfaces/services'

import styles from './../../styles/Clients.module.css'

interface UpdateRowData {
  id: number,
  serviceName: string,
  updateTime: number,
  able: number
}

const ViewClients: NextPage = () => {
  const alertHook = useAlert()

  const [ updateRowData, setUpdateRowData ] = useState<UpdateRowData | undefined>(undefined)
  const [ updateRows, setUpdateRows ] = useState<boolean>(false)

  const [ showUpdateClientModal, setShowUpdateClientModal ] = useState<boolean>(false)
  const [ clientIDToUpdate, setClientIDToUpdate ] = useState<number>(0)
  const [ nameOfClientToUpdate, setNameOfClientToUpdate ] = useState<string>('')
 
  const clients = usePublicAccessClients({ updateState: updateRows })
  const clientsOperations = usePublicAccessClientsOperations({ setUpdateState: setUpdateRows })
  
  // const services = useServices({ updateState: updateRows, setUpdateState: setUpdateRows })
  // const servicesOperations = useServicesOperations(setUpdateRows)

  const [ isUpdating, setIsUpdating ] = useState<Array<number>>([])

  function normalizeData() {
    return clients.map((client) => {
      return {
        id: client.id,
        col1: client.identifier,
        col2: client.key,
        able: client.able
      }
    })
  }

  async function clipToClipboard(content: string) {
    await navigator.clipboard.writeText(content)

    alert('chave copiada!')
  }

  async function removeClient(identifier: string) {
    const result = await clientsOperations.remove(identifier)

    if (result) {
      alert('cliente removido com sucesso!')
    }
  }

  async function updateClient(clientID: number, able: number) {
    const result = await clientsOperations.update(clientID, { able })

    if (result) {
      alertHook.showAlert('cliente atualizado com sucesso!', 'success')
    }
  }

  function renderClientModal() {
    if (showUpdateClientModal && clientIDToUpdate > 0 && nameOfClientToUpdate.length > 0) {
      return (
        <EditClientModal
          clientID={clientIDToUpdate}
          name={nameOfClientToUpdate}
          setUpdateRows={setUpdateRows}
          setShowUpdateClientModal={setShowUpdateClientModal}
        />
      )
    }
  }

  const rows = normalizeData()

  const columns = [
    { field: 'col1', headerName: 'Cliente', width: 150 },
    // { field: 'col2', headerName: 'Chave', width: 150 },
    {
      field: 'col2',
      headerName: 'Chave',
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']
        const key: string = row['col2']

        return (
          <div className={styles.key_container}>
            <p className={styles.key_text}>{key}</p>

            <IconButton 
              aria-label="copy content"
              sx={{
                zIndex: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
              className={styles.key_button}
              onClick={() => clipToClipboard(key)}
            >
              <FileCopy />
            </IconButton>
          </div>
        )
      }
    },
    {
      field: 'col3',
      headerName: 'Habilitados',
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']

        const id: number = row['id']
        const identifier: string = row['col1']
        const key: string = row['col2']
        const able: number = row['able']

        return (
          <div className={styles.key_container}>
            <Button 
              variant="contained" 
              color={able === 1 ? 'success' : 'error'}
              onClick={() => updateClient(id, able === 1 ? 2 : 1)}
            >
              {able === 1 ? 'Habilitado' : 'Desabilitado'}
            </Button>
          </div>
        )
      }
    },
    {
      field: 'col4',
      headerName: 'Ações',
      width: 200,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']

        const id: number = row['id']
        const identifier: string = row['col1']
        const key: string = row['col2']

        return (
          <div className={styles.key_container}>
            <Button 
              variant="contained" 
              color='warning'
              onClick={() => {
                setClientIDToUpdate(id)
                setNameOfClientToUpdate(identifier)
                setShowUpdateClientModal(true)
              }}
            >
              Editar
            </Button>

            <Button 
              variant="contained" 
              color='error'
              onClick={() => removeClient(identifier)}
            >
              Remover
            </Button>
          </div>
        )
      }
    }
    // { 
    //   field: 'col3', 
    //   headerName: 'Link', 
    //   width: 150, 
    //   disableClickEventBubbling: true, 
    //   // renderCell: (cellValues: any) => {
    //   //   const serviceName: string = cellValues['row']['col1']

    //   //   return (
    //   //     // <Link href={makeServiceURL(serviceName)}>{makeServiceURL(serviceName)}</Link>
    //   //     <Button 
    //   //       variant="contained" 
    //   //       color='primary'
    //   //       onClick={() => window.open(makeServiceURL(serviceName))}
    //   //     >
    //   //       acessar site
    //   //     </Button>
    //   //   )
    //   // },
    // },
    // { 
    //   field: 'col4', 
    //   headerName: 'Serviço', 
    //   width: 150, 
    //   disableClickEventBubbling: true, 
    //   // renderCell: (cellValues: any) => {
    //   //   const id: number = cellValues['row']['id']
    //   //   const able: number = cellValues['row']['able']

    //   //   return (
    //   //     <Button 
    //   //       variant="contained" 
    //   //       color={returnServiceAbleColorType(able)}
    //   //       onClick={() => serviceAbleOnClick(id, able)}
    //   //     >
    //   //       {renderServiceAbleText(able)}
    //   //     </Button>
    //   //   )
    //   // },
    // },
    // { field: 'col5', headerName: 'Status de serviço', width: 150 },
    // { 
    //   field: 'col6', 
    //   headerName: 'Ações', 
    //   width: 280, 
    //   disableClickEventBubbling: true, 
    //   // renderCell: (cellValues: any) => {
    //   //   const row: any = cellValues['row']

    //   //   const serviceName: string = row['col1']
    //   //   const id: number = row['id']

    //   //   // const able: number = cellValues['row']['able']

    //   //   return (
    //   //     <div className={styles.actions_container}>
    //   //       <Button 
    //   //         variant="contained" 
    //   //         color='info'
    //   //         onClick={() => updateServiceInformation(id, serviceName)}
    //   //       >
    //   //         {renderUpdateServiceInformationButtonContent(id)}
    //   //       </Button>
          
    //   //       <Button 
    //   //         variant="contained" 
    //   //         color='warning'
    //   //         onClick={() => handleRow(row)}
    //   //       >
    //   //         Editar
    //   //       </Button>
    //   //     </div>
    //   //   )
    //   // },
    // },
  ]

  return (
    <>
      <Head>
        <title>Visualizar Clientes</title>
      </Head>

      {renderClientModal()}

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

export default ViewClients