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
  const [ expirationTime, setExpirationTime ] = useState<string>('')
  
  const [ flow4Detector, setFlow4Detector ] = useState<boolean>(false)
  const [ flow4Energy, setFlow4Energy ] = useState<boolean>(false)

  async function createClient() {
    if (identifier.length > 0) {
      const result = await publicAccessClientsOperations.create(identifier, expirationTime, flow4Detector, flow4Energy)

      if (result) {
        alertOperation.showAlert('cliente criado com sucesso!', 'success')
      }
    }
  }

  const expirationTimeOptions = [
    {
      firstLetter: '1',
      label: '1 mês',
      option: '1 mês',
      value: '1 month'
    },
    {
      firstLetter: '6',
      label: '6 meses',
      option: '6 meses',
      value: '6 months'
    },
    {
      firstLetter: '1',
      label: '1 ano',
      option: '1 ano',
      value: '1 year'
    },
    {
      firstLetter: 'I',
      label: 'Indeterminado',
      option: 'Indeterminado',
      value: 'undefined'
    },
  ]

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

              <Autocomplete
                // value={autoCompleteValue}
                onChange={(event, newValue) => {
                  if (!!newValue) {
                    setExpirationTime(newValue.value)
                  }
                }}
                options={expirationTimeOptions}
                // groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.option}
                sx={{
                  width: 200
                }}
                renderInput={(params) => <TextField {...params} label="Tempo de expiração" />}
              />

              <Box
                component='div'
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Checkbox
                  checked={flow4Detector}
                  onChange={(event) => setFlow4Detector(event.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />

                <Typography
                  variant='subtitle2'
                  component='p'
                >
                  flow4Detector
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
                  checked={flow4Energy}
                  onChange={(event) => setFlow4Energy(event.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />

                <Typography
                  variant='subtitle2'
                  component='p'
                >
                  flow4Energy
                </Typography>
              </Box>
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