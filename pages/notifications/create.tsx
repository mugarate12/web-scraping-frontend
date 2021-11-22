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
  Checkbox,
  Paper,
  InputAdornment,
  Select,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core'

import {
  AccountCircle
} from '@material-ui/icons'

import {
  useAlert,
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
  const alertOperation = useAlert()
  const publicAccessClientsOperations = usePublicAccessClientsOperations({})

  const [ identifier, setIdentifier ] = useState<string>('')

  const [ automatic, setAutomatic ] = useState<boolean>(false)
  const [ manual, setManual ] = useState<boolean>(false)
  const [ limit, setLimit ] = useState<number>(50)

  useEffect(() => {
    if (automatic) {
      setManual(false)
      setLimit(50)
    }
  }, [ automatic ])

  useEffect(() => {
    if (manual) {
      setAutomatic(false)
    }
  }, [ manual ])

  async function createClient() {
    if (identifier.length > 0) {
      const result = await publicAccessClientsOperations.create(identifier)

      if (result) {
        alertOperation.showAlert('cliente criado com sucesso!', 'success')
      }
    }
  }

  return (
    <>
      <Head>
        <title>Criar Notificação</title>
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
              <Box
                component='div'
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Checkbox
                  checked={automatic}
                  onChange={(event) => setAutomatic(event.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />

                <Typography
                  variant='subtitle2'
                  component='p'
                >
                  Automático
                </Typography>
              </Box>
              
              <Box
                component='div'
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Checkbox
                  checked={manual}
                  onChange={(event) => setManual(event.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />

                <Typography
                  variant='subtitle2'
                  component='p'
                >
                  Manual
                </Typography>
              </Box>

              <TextField
                label="notificar acima de"
              
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <AccountCircle sx={{ color: '#000' }} />
                //     </InputAdornment>
                //   ),
                // }}
                value={limit}
                onChange={(event) => {
                  // event.target.value
                  if (Number(event.target.value) >= 0) {
                    setLimit(Number(event.target.value))
                  }
                }}
              />

              <TextField
                label="mensagem"
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <AccountCircle sx={{ color: '#000' }} />
                //     </InputAdornment>
                //   ),
                // }}
                multiline
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
          >configurar</Button>
        </Box>
      </main>
    </>
  )
}

export default CreateClient