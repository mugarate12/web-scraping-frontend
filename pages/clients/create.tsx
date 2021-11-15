import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useEffect,
  useState
} from 'react'

import {
  Autocomplete,
  Button,
  Box,
  Paper,
  InputAdornment,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core'

import {
  AccountCircle
} from '@material-ui/icons'

import {
  useOptions,
  usePublicAccessClientsOperations
} from './../../hooks'

interface OptionsFormatted {
  value: string,
  option: string,
  firstLetter: string
}

import styles from './../../styles/Services.module.css'

const CreateClient: NextPage = () => {
  const options = useOptions()
  const publicAccessClientsOperations = usePublicAccessClientsOperations({})

  const [ identifier, setIdentifier ] = useState<string>('')

  async function createClient() {
    if (identifier.length > 0) {
      const result = await publicAccessClientsOperations.create(identifier)

      if (result) {
        alert ('cliente criado com sucesso!')
      }
    }
  }

  return (
    <>
      <Head>
        <title>Criar Cliente</title>
      </Head>

      <main className={styles.container}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'nowrap',
            '& > :not(style)': {
              minWidth: 100,
              width: 'fit-content',
              minHeight: 100,
              height: 'fit-content',
            },
          }}
        >
          <Paper 
            elevation={3}
            sx={{
              zIndex: 2,
              position: 'relative'
            }}
          >
            <Box
              component="form"
              sx={{
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="identifier"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: '#000' }} />
                    </InputAdornment>
                  ),
                }}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
              />
            </Box>
          </Paper>

          <Button 
            variant="contained" 
            size='small'
            style={{
              minHeight: '10px',
              // height: 'fit-content',
              minWidth: '10px',
              width: '80%',

              padding: '5px 0px',

              backgroundColor: '#FFF',
              color: '#333',

              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px'
            }}
            onClick={() => createClient()}
          >criar</Button>
        </Box>
      </main>
    </>
  )
}

export default CreateClient