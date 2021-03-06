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
  EditUsersModal
} from './../../containers'

import {
  useUsers
} from './../../hooks'

import styles from './../../styles/ViewServices.module.css'

interface UpdateRowData {
  id: number,
  login: string
}

const ViewUsers: NextPage = () => {
  const [ updateRowData, setUpdateRowData ] = useState<UpdateRowData | undefined>(undefined)
  const [ updateRows, setUpdateRows ] = useState<boolean>(false)
  const [ showUpdateModal, setShowUpdateModal ] = useState<boolean>(false)

  const users = useUsers({ updateUsersState: updateRows, setUpdateUsersState: setUpdateRows })
  
  function normalizeData() {
    return users.map((user) => {
      return {
        id: user.id,
        col1: user.login
      }
    })
  }

  function handleRow(params: any) {
    const row = params['row']

    const id = row.id
    const login = row.col1

    setUpdateRowData({
      id,
      login
    })
    setShowUpdateModal(true)
  }

  const rows = normalizeData()

  const columns = [
    { field: 'col1', headerName: 'Nome', width: 150 },
    // { field: 'col2', headerName: 'Tempo', width: 150 },
  ]

  function renderEditUsersModal() {
    if (updateRowData !== undefined && showUpdateModal) {
      return (
        <EditUsersModal 
          id={updateRowData.id}
          login={updateRowData.login}
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

      {renderEditUsersModal()}

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

export default ViewUsers