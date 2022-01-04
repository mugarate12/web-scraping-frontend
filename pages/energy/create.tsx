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
  useDealershipsAndUpdateTimes,
  useOptions,
  useServicesOperations,
  useEnergyOperations,
  useStatesAndCities,
} from './../../hooks'

import styles from './../../styles/Energy.module.css'

const CreateEnergy: NextPage = () => {
  const [ dealership, setDealership ] = useState<string>('')
  const [ state, setState ] = useState<string>('')
  const [ city, setCity ] = useState<string>('')
  const [ updateTime, setUpdateTime ] = useState<number>()

  const statesAndCities = useStatesAndCities({ dealership, state, city })
  const dealershipsAndUpdateTimes = useDealershipsAndUpdateTimes()
  const energyOperations = useEnergyOperations({})
  
  function formatOptions(payload: Array<{ value: string, label: string}>) {
    const formatted = payload.map(stateValue => {
      const firstLetter = stateValue.label[0].toUpperCase()
      const option = stateValue.label

      return {
        firstLetter,
        option,
        ...stateValue
      }
    })

    return formatted
  }
  
  function formatOptionsToStates(payload: Array<{ value: string, label: string}>) {
    const formatted = payload.map(stateValue => {
      const firstLetter = stateValue.label[0].toUpperCase()
      const option = stateValue.label.toUpperCase()

      return {
        ...stateValue,
        firstLetter,
        option
      }
    })

    return formatted
  }
  
  function formatOptionsToCities(payload: Array<{ value: string, label: string}>) {
    const formatted = payload.map(stateValue => {
      const firstLetter = stateValue.label[0].toUpperCase()
      const option = stateValue.label

      return {
        ...stateValue,
        firstLetter,
        option,
        value: stateValue.label
      }
    })

    return formatted
  }

  return (
    <>
      <Head>
        <title>Criar Monitoramento de energia</title>
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
                    setDealership(newValue.value)
                  }
                }}
                options={formatOptions(dealershipsAndUpdateTimes.dealerships).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.option}
                sx={{
                  width: 200
                }}
                renderInput={(params) => <TextField {...params} label="Concessionárias" />}
              />

              <Autocomplete
                // value={autoCompleteValue}
                onChange={(event, newValue) => {
                  if (!!newValue) {
                    setState(newValue.value)
                  }
                }}
                options={formatOptionsToStates(statesAndCities.states).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.option}
                sx={{
                  width: 200
                }}
                renderInput={(params) => <TextField {...params} label="Opções" />}
                disabled={!!statesAndCities.states && statesAndCities.states.length > 0 ? false : true}
              />
              
              <Autocomplete
                // value={autoCompleteValue}
                onChange={(event, newValue) => {
                  if (!!newValue) {
                    setCity(newValue.value)
                  }
                }}
                options={formatOptionsToCities(statesAndCities.cities).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.option}
                sx={{
                  width: 200
                }}
                renderInput={(params) => <TextField {...params} label="Cidades" />}
                disabled={!!statesAndCities.cities && statesAndCities.cities.length > 0 ? false : true}
              />

              <Autocomplete
                // value={autoCompleteValue}
                onChange={(event, newValue) => {
                  if (!!newValue) {
                    setUpdateTime(Number(newValue.value))
                  }
                }}
                options={formatOptions(dealershipsAndUpdateTimes.updatesTimes).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                // groupBy={(option) => option.firstLetter}
                // getOptionLabel={(option) => option.option}
                sx={{
                  width: 200
                }}
                renderInput={(params) => <TextField {...params} label="Tempo de atualizaçao" />}
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
            onClick={() => energyOperations.create({ dealership, state, city, update_time: Number(updateTime) })}
          >monitorar</Button>
        </Box>
      </main>
    </>
  )
}

export default CreateEnergy