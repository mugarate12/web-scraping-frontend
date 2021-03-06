import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useEffect,
  useState
} from 'react'
import moment from 'moment'
import 'moment/locale/pt-br'

import {
  Button,
  IconButton
} from '@material-ui/core'

import { 
  DataGrid
} from '@mui/x-data-grid'

import {
  FileCopy
} from '@material-ui/icons'

import {
  ActionConfirmation
} from './../../components'

import {
  EditClientModal,
  SetServicesModal
} from './../../containers'

import {
  useAlert,
  usePublicAccessClients,
  usePublicAccessClientsOperations
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
  const [ clientFKToUpdate, setClientFkToUpdate ] = useState<number>(0)
  const [ nameOfClientToUpdate, setNameOfClientToUpdate ] = useState<string>('')
  const [ expirationTimeToUpdate, setExpirationTimeToUpdate ] = useState<string>('')
 
  const clients = usePublicAccessClients({ updateState: updateRows })
  const clientsOperations = usePublicAccessClientsOperations({ setUpdateState: setUpdateRows })

  const [ showAccessModal, setShowAccessModal ] = useState<boolean>(false)

  const [ isUpdating, setIsUpdating ] = useState<Array<number>>([])
  const [ clientKeyToUpdate, setClientKeyToUpdate ] = useState<string>('')

  const [ deleteConfirmationModal, setDeleteConfirmationModal ] = useState<boolean>(false)
  const [ deleteKey, setDeleteKey ] = useState<boolean>(false)
  const [ clientIdentifierToDelete, setClientIdentifierToDelete ] = useState<string>('')

  function formatExpirationTime(expirationTime: string) {
    if (expirationTime === 'undefined') {
      return 'Indeterminada'
    } else {
      return expirationTime
    }
  }

  function normalizeData() {
    return clients.map((client) => {
      return {
        id: client.id,
        col1: client.identifier,
        col2: client.key,
        col4: formatExpirationTime(client.expiration_time),
        able: client.able,
        clietFK: client.api_access_client_FK
      }
    })
  }

  async function clipToClipboard(content: string) {
    if (typeof (navigator.clipboard) == 'undefined') {
      let textArea = document.createElement('textarea')
      
      textArea.value = content
      textArea.style.position = "fixed"
      document.body.appendChild(textArea)
  
      textArea.focus()
      textArea.select()
  
      document.execCommand('copy')
  
      document.body.removeChild(textArea)
      
      alertHook.showAlert('chave copiada!', 'success')
    } else {
      await navigator.clipboard.writeText(content)
      alertHook.showAlert('chave copiada!', 'success')
    }
  }

  async function removeClient(identifier: string) {
    setClientIdentifierToDelete(identifier)
    setDeleteConfirmationModal(true)
  }
  
  async function confirmationRemoveClient() {
    const result = await clientsOperations.remove(clientIdentifierToDelete)
  
    if (result) {
      alertHook.showAlert('cliente removido com sucesso!', 'success')
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
          expirationTime={expirationTimeToUpdate}
          setUpdateRows={setUpdateRows}
          setShowModal={setShowUpdateClientModal}
        />
      )
    }
  }

  function renderAccessModal() {
    if (showAccessModal && !!clientKeyToUpdate) {
      return (
        <SetServicesModal
          title='Modificar acessos'
          setViewModal={setShowAccessModal}
          clientKey={clientKeyToUpdate}
          clientID={clientIDToUpdate}
          clientFK={clientFKToUpdate}
        />
      )
    }
  }

  function renderDeleteConfirmationModal() {
    if (deleteConfirmationModal) {
      return (
        <ActionConfirmation
          title='Deseja deletar key?'
          setConfirmationAction={setDeleteKey}
          setShowModal={setDeleteConfirmationModal}
        />
      )
    }
  }

  useEffect(() => {
    if (deleteKey) {
      confirmationRemoveClient()
    }
  }, [ deleteKey ])

  const rows = normalizeData()

  const columns = [
    { field: 'col1', headerName: 'Cliente', width: 250 },
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
      headerName: 'Data de expira????o',
      width: 150,
    },
    {
      field: 'col5',
      headerName: 'A????es',
      width: 250,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']

        const id: number = row['id']
        const identifier: string = row['col1']
        const key: string = row['col2']
        const expirationTimeOfClient = row['col4']
        const clientFK = row['clietFK']

        return (
          <div className={styles.key_container}>
            <Button 
              variant="contained" 
              color='warning'
              onClick={() => {
                setClientIDToUpdate(id)
                setNameOfClientToUpdate(identifier)
                setShowUpdateClientModal(true)
                setExpirationTimeToUpdate(expirationTimeOfClient)
              }}
            >
              Editar
            </Button>
            
            <Button 
              variant="outlined" 
              color='warning'
              sx={{
                minWidth: 80
              }}
              onClick={() => {
                setClientKeyToUpdate(key)
                setShowAccessModal(true)
                setClientFkToUpdate(clientFK)
                setClientIDToUpdate(id)
              }}
            >
              Acessos
            </Button>

            <Button 
              variant="contained" 
              color='error'
              sx={{
                minWidth: 80
              }}
              onClick={() => removeClient(identifier)}
            >
              Remover
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <>
      <Head>
        <title>Visualizar Clientes</title>
      </Head>

      {renderClientModal()}
      {renderAccessModal()}
      {renderDeleteConfirmationModal()}

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