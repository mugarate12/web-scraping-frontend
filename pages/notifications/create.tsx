import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction
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

import styles from './../../styles/Notifications.module.css'

const CreateClient: NextPage = () => {
  const options = useOptions()
  const alertOperation = useAlert()
  const publicAccessClientsOperations = usePublicAccessClientsOperations({})

  const [ message, setMessage ] = useState<string>('')

  const [ automatic, setAutomatic ] = useState<boolean>(true)
  const [ manual, setManual ] = useState<boolean>(false)
  const [ limit, setLimit ] = useState<number>(50)

  const [ disableNumberOfNotifications, setDisableNumberOfNotifications ] = useState<boolean>(false)
  const [ manualHour, setManualHour ] = useState<boolean>(false)
  const [ manualDate, setManualDate ] = useState<boolean>(false)
  const [ manualSite, setManualSite ] = useState<boolean>(false)
  const [ manualStatus, setManualStatus ] = useState<boolean>(false)

  const AutomaticMessage = '❌ O problema começou às HORA (21:00:00) em 21/11/2021\nSite: Facebook\nStatus: Usuários indicam problemas no facebook\nReports: 50 | Valor Anterior: 30\nBaseline: 40 | Valor Anterior: 34'

  function formatManualMessage() {
    const hour = manualHour ? `às 18:55:52` : ''
    const date = manualDate ? `em 09-11-2021` : ''
    const problem = !manualHour && !manualDate ? '❌ Problemas foram encontrados' : `❌ O problema começou ${hour} ${date}`

    let message = ''

    message = message + problem
    if (manualSite) {
      message = `${message}\nSite: Facebook`
    }

    if (manualStatus) {
      message = `${message}\nStatus: Usuários indicam problemas do Facebook`
    }

    message = `${message}\nReports: 50 | Valor Anterior: 30\nBaseline: 40 | Valor Anterior: 34`
    
    setMessage(message)
  }

  useEffect(() => {
    if (automatic) {
      setManual(false)

      setDisableNumberOfNotifications(true)
      setLimit(50)
      setMessage(AutomaticMessage)
    }
  }, [ automatic ])

  useEffect(() => {
    if (manual) {
      setAutomatic(false)
      setDisableNumberOfNotifications(false)

      formatManualMessage()
    }
  }, [ manual ])

  useEffect(() => {
    if (manualHour) {
      formatManualMessage()
    }
  }, [ manualHour ])
  
  useEffect(() => {
    if (manualDate) {
      formatManualMessage()
    }
  }, [ manualDate ])
 
  useEffect(() => {
    if (manualSite) {
      formatManualMessage()
    }
  }, [ manualSite ])
 
  useEffect(() => {
    if (manualStatus) {
      formatManualMessage()
    }
  }, [ manualStatus ])

  async function createClient() {
    console.log(message);
  }

  function renderCheckbox(state: boolean, setState: Dispatch<SetStateAction<boolean>>, description: string, fitContent?: boolean) {    
    return (
      <Box
        component='div'
        sx={{
          width: !!fitContent ? 'fit-content' : '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Checkbox
          checked={state}
          onChange={(event) => setState(event.target.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
        />

        <Typography
          variant='subtitle2'
          component='p'
        >
          {description}
        </Typography>
      </Box>
    )
  }

  function renderManualOptions() {
    if (manual) {
      return(
        <div className={styles.manual_options_container}>
          {renderCheckbox(manualHour, setManualHour, 'incluir hora', true)}
          
          {renderCheckbox(manualDate, setManualDate, 'incluir data', true)}

          {renderCheckbox(manualSite, setManualSite, 'incluir site', true)}

          {renderCheckbox(manualStatus, setManualStatus, 'incluir status', true)}
        </div>
      )
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
            width: '100%',

            padding: '0px 30px',

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'nowrap',
            '& > :not(style)': {
              minWidth: 200,
              width: '100%',
              minHeight: 100,
              height: 'fit-content',
            },
          }}
        >
          <Paper 
            elevation={3}
            sx={{
              zIndex: 2,
              position: 'relative',

              minWidth: '200px',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <Box
              component="form"
              sx={{
                padding: '40px 20px',

                width: '100%',
                
                display: 'flex',
                flexDirection: 'column',
                '& > :not(style)': { m: 1 },
              
              }}
              noValidate
              autoComplete="off"
            >
              {renderCheckbox(automatic, setAutomatic, 'Automático')}

              {renderCheckbox(manual, setManual, 'Manual')}

              <TextField
                label="notificar acima de"        
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <AccountCircle sx={{ color: '#000' }} />
                //     </InputAdornment>
                //   ),
                // }}
                disabled={disableNumberOfNotifications}
                value={limit}
                onChange={(event) => {
                  // event.target.value
                  if (Number(event.target.value) >= 0) {
                    setLimit(Number(event.target.value))
                  }
                }}
              />

              {renderManualOptions()}

              <TextField
                label="mensagem"
                multiline
                disabled={true}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Box>
          </Paper>

          <Button 
            variant="contained" 
            size='small'
            style={{
              minHeight: '10px',
              // height: 'fit-content',
              minWidth: '100px',
              width: '80%',
              maxWidth: '300px',

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