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
  EditHostPerfilModal
} from './../../containers'

import {
  useAlert,
  useHostsPerfis,
  useHostsPerfisOperations
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

  const [ updateHostsPerfis, setUpdateHostsPerfis ] = useState<boolean>(false)

  const hostsPerfis = useHostsPerfis({ update: updateHostsPerfis, setUpdate: setUpdateHostsPerfis })
  const hostsPerfisOperations = useHostsPerfisOperations()

  const [ confirmationDeleteModal, setConfirmationDeleteModal ] = useState<boolean>(false)
  const [ confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [ perfilIDToDelete, setPerfilIDToDelete ] = useState<number>()

  const [ showEditModal, setShowEditModal ] = useState<boolean>(false)
  const [ userToEdit, setUserToEdit ] = useState<{
    id: number,
    name: string,
    user: string,
    password: string,
    url: string,
    link: string,
  }>()

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
      
      alertHook.showAlert('copiada!', 'success')
    } else {
      await navigator.clipboard.writeText(content)
      alertHook.showAlert('copiada!', 'success')
    }
  }

  async function removeClient() {
    if (!!confirmDelete && !!perfilIDToDelete) {
      const result = await hostsPerfisOperations.remove({ id: perfilIDToDelete })
  
      if (result) {
        setUpdateHostsPerfis(true)
  
        setConfirmDelete(false)
        setConfirmationDeleteModal(false)
        setPerfilIDToDelete(undefined)
      }
    }
  }

  function normalizeData() {
    return hostsPerfis.map((perfil) => {
      return {
        id: perfil.id,
        col1: perfil.name,
        col2: perfil.user,
        col3: perfil.password,
        col4: perfil.url,
        col5: perfil.worksheet_link
      }
    })
  }

  const rows = normalizeData()

  const columns = [
    { field: 'col1', headerName: 'Nome', width: 250 },
    { field: 'col2', headerName: 'Usuário', width: 150 },
    { field: 'col3', headerName: 'Senha', width: 150 },
    { 
      field: 'col4', 
      headerName: 'Url', 
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']
        const key: string = row['col4']

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
      field: 'col5', 
      headerName: 'Link', 
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']
        const key: string = row['col5']

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
      field: 'col6', 
      headerName: 'Ações', 
      width: 170,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']

        const id: number = row['id']
        const name: string = row['col1']
        const user: string = row['col2']
        const password: string = row['col3']
        const url: string = row['col4']
        const link: string = row['col5']

        return (
          <div className={styles.key_container}>
            <Button 
              variant="contained" 
              color='warning'
              onClick={() => {
                setUserToEdit({
                  id,
                  name,
                  user,
                  password,
                  url, 
                  link
                })

                setShowEditModal(true)
              }}
            >
              Editar
            </Button>
            
            <Button 
              variant="contained" 
              color='error'
              onClick={() => {
                setConfirmationDeleteModal(true)
                setPerfilIDToDelete(id)
              }}
            >
              deletar
            </Button>
          </div>
        )
      }
    }
  ]

  function renderShowConfirmUpdatePermission() {
		if (confirmationDeleteModal) {
			return (
				<ActionConfirmation
					title='Deseja excluir este Perfil?'
					setConfirmationAction={setConfirmDelete}
					setShowModal={setConfirmationDeleteModal}
				/>
			)
		}
	}

  function renderEditModal() {
    if (showEditModal && !!userToEdit) {
      return (
        <EditHostPerfilModal
          title='Editar perfil'
          setViewModal={setShowEditModal}
          setUpdatePerfis={setUpdateHostsPerfis}
        
          id={userToEdit.id}
          name={userToEdit.name}
          user={userToEdit.user}
          password={userToEdit.password}
          url={userToEdit.url}
          link={userToEdit.link}
        />
      )
    }
  }

  useEffect(() => {
    removeClient()
  }, [ confirmDelete ])

  return (
    <>
      <Head>
        <title>Visualizar Clientes</title>
      </Head>

      {renderShowConfirmUpdatePermission()}
      {renderEditModal()}

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
            />
          </div>
      </main>
    </>
  )
}

export default ViewClients