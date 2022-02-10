import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useState
} from 'react'

import {
  Box,
  Button,
  Typography
} from '@material-ui/core'

import { 
  DataGrid
} from '@mui/x-data-grid'

import {
  useOCRServices,
  useOCROperations
} from './../../hooks'

import styles from './../../styles/OCRServicesIndex.module.css'

const ViewOCRServices: NextPage = () => {
  const [ updateServices, setUpdateServices ] = useState<boolean>(false)
  const services = useOCRServices({ update: updateServices, setUpdate: setUpdateServices })
  const operations = useOCROperations()

  function normalizeServicesData() {
    return  services.map(service => {
      const id = service.id
      const state = service.state
      const city = service.city
      const pix = service.pix_name
      const able = service.able

      return {
        id,
        col1: pix,
        col2: state,
        col3: city,
        able
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

  async function serviceAbleOnClick(able: number, state: string, city: string, pix: string) {
    if (able === 1) {
      await operations.updateServiceAble(state, city, pix, 2)
      setUpdateServices(true)
    } else {
      await operations.updateServiceAble(state, city, pix, 1)
      setUpdateServices(true)
    }
  }

  function renderServiceAbleText(able: number) {
    if (able === 1) {
      return 'Habilitado'
    } else {
      return 'Desabilitado'
    }
  }

  const columns = [
    { field: 'col1', headerName: 'Pix', width: 150 },
    { field: 'col2', headerName: 'Estado', width: 150 },
    { field: 'col3', headerName: 'Cidade', width: 150 },
    { 
      field: 'col4', 
      headerName: 'Habilitado', 
      width: 150, 
      disableClickEventBubbling: true, 
      renderCell: (cellValues: any) => {
        const id: number = cellValues['row']['id']
        const able: number = cellValues['row']['able']

        const service: string = cellValues['row']['col1']
        const state: string = cellValues['row']['col2']
        const city: string = cellValues['row']['col3']

        return (
          <Button 
            variant="contained" 
            color={returnServiceAbleColorType(able)}
            onClick={() => serviceAbleOnClick(able, state, city, service)}
          >
            {renderServiceAbleText(able)}
          </Button>
        )
      },
    },
  ]

  const rows = normalizeServicesData()

  return (
    <>
      <Head>
        <title>Ver serviços (OCR)</title>
      </Head>

      <main className={styles.container}>
        <Typography
          variant='subtitle1'
          sx={{
            padding: '0px 30px',
            paddingTop: '5px'
          }}
        >
          {`Caso queira, uma vez que esteja habilitado, associar um cliente a um serviço acesse: "Clientes" -> "Ver clientes". `}
        </Typography>

        <Typography
          variant='subtitle1'
          sx={{
            padding: '0px 30px',
            paddingTop: '5px'
          }}
        >
          No cliente desejado selecione "Acessos", selecione "OCR" informando em seguida Estado e Cidade para selecionar quais serviços este cliente deve ter acesso
        </Typography>

        <div style={{ 
          height: '100%', 
          width: '100%',
          padding: '10px 30px'
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

export default ViewOCRServices