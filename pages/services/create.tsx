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
  AccessTime
} from '@material-ui/icons'

import {
  useOptions,
  useServicesOperations
} from './../../hooks'

interface OptionsFormatted {
  value: string,
  option: string,
  firstLetter: string
}

import styles from './../../styles/Services.module.css'

const CreateService: NextPage = () => {
  const options = useOptions()
  const servicesOperations = useServicesOperations()

  const [ optionsFormatted, setOptionsFormatted ] = useState<Array<OptionsFormatted>>([])
  const [ serviceName, setServiceName ] = useState<string>('')
  const [ time, setTime ] = useState<number>(1)

  function formatOptions() {
    const formatted = options.map(option => {
      const firstLetter = option.option[0].toUpperCase()

      return {
        firstLetter,
        ...option
      }
    })

    setOptionsFormatted(formatted)
  }

  useEffect(() => {
    if (options.length > 0) {
      setServiceName(options[0].value)
      formatOptions()
    }
  }, [ options ])

  return (
    <>
      <Head>
        <title>Criar serviço</title>
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
              <Autocomplete
                // value={autoCompleteValue}
                onChange={(event, newValue) => {
                  if (!!newValue) {
                    setServiceName(newValue.value)
                  }
                }}
                options={optionsFormatted.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.option}
                sx={{
                  width: 200
                }}
                renderInput={(params) => <TextField {...params} label="Ordem alfabética" />}
              />

              <Select
                value={time}
                onChange={(event) => setTime(Number(event.target.value))}
              >
                <MenuItem value={1}>1 minuto</MenuItem>
                <MenuItem value={3}>3 minutos</MenuItem>
                <MenuItem value={5}>5 minutos</MenuItem>
                <MenuItem value={10}>10 minutos</MenuItem>
                <MenuItem value={15}>15 minutos</MenuItem>
              </Select>
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
            onClick={() => servicesOperations.createService(serviceName, time)}
          >monitorar</Button>
        </Box>
      </main>
    </>
  )
}

export default CreateService