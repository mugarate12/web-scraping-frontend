import { 
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react'

import {
	Autocomplete,
  Button,
  Box,
  Checkbox,
  InputAdornment,
  Typography,
  TextField
} from '@material-ui/core'

import {
  Modal
} from './../../components'

import {
  useCitiesOfClientKeyHavePermission,
  usePublicAccessClients,
  usePublicAccessClientsOperations,
  useDealershipsAndUpdateTimes,
  useEnergy,
  useEnergyOperations,
  useStatesAndCities
} from './../../hooks'

import { apiEnergy } from './../../config'

import styles from './SetServicesModal.module.css'

interface EnergyServiceInterface {
  id: number,
  state: string,
  city: string,
  // 1 is able and 2 is disable
  able: number,
  dealership: string,
  update_time: number
}

interface getEnergyServicesInterface {
  data: Array<EnergyServiceInterface>
}

interface Props {
  title: string,
  setViewModal: Dispatch<SetStateAction<boolean>>,
  clientKey: string,
  clientID: number
}

export default function SetServicesModal({
  title,
  setViewModal,
  clientKey,
  clientID
}: Props) {
  const [ dealership, setDealership ] = useState<string>('')
  const [ state, setState ] = useState<string>('')
  const [ city, setCity ] = useState<string>('')

  const dealershipsAndUpdateTimes = useDealershipsAndUpdateTimes()
  const statesAndCities = useStatesAndCities({ dealership, state, city })
  const energyServices = useEnergy({})
  // const servicesPermitted = useCitiesOfClientKeyHavePermission({ dealership, state, clientKey })
  const [ servicesPermitted, setServicesPermitted ] = useState<Array<EnergyServiceInterface>>([])
  const energyOperations = useEnergyOperations({})
  const publicAccessClientsOperations = usePublicAccessClientsOperations({})

  const [ permissionsArray, setPermissionsArray ] = useState<Array<{
    dealership: string,
    state: string,
    city: string
  }>>([])

  async function getEnergyServices() {
    await apiEnergy.get<getEnergyServicesInterface>(`/service/cpfl/client/access/${dealership}/${state}/${clientKey}`)
      .then((response) => {
        setServicesPermitted(response.data.data)
        console.log(response.data.data)
      })
      .catch(error => console.log(error))
  }

  function permissionsArrayLoaded() {
    let array: Array<{
      dealership: string,
      state: string,
      city: string
    }> = []

    servicesPermitted.forEach(service => {
      array.push({
        dealership: service.dealership,
        state: service.state,
        city: service.city
      })
    })

    setPermissionsArray(array)
  }

  useEffect(() => {
    if (!!dealership && !!state && !!clientKey) {
      getEnergyServices()
    }
  }, [ dealership, state, clientKey ])

  // useEffect(() => {
  //   permissionsArrayLoaded()
  // }, [ servicesPermitted ])

  function haveService(services: EnergyServiceInterface[], city: EnergyServiceInterface) {
    let have = false

    services.forEach((service) => {
      if (service.id === city.id) {
        have = true
      }
    })

    console.log(have)
    return have
  }

  function havePermissionInArray(array: Array<{
    dealership: string,
    state: string,
    city: string
  }>, dealership: string, state: string, city: string) {
    let have = false

    array.forEach((service => {
      if (service.dealership === dealership && service.city === city && service.state === state) {
        have = true
      }
    }))

    return have
  }

  async function update() {
    publicAccessClientsOperations.update(clientID, { permissionsArray, flow4Energy: true, flow4Detector: true })
  }

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

  function renderCities() {
    let filteredEnergyServices = energyServices.filter(energyService => energyService.dealership === dealership && energyService.state === state)

    if (!!dealership && !!state) {
      return filteredEnergyServices.map((energyService) => {
        const cheked = haveService(servicesPermitted, energyService)

        return (
          <Box
            component='div'
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Checkbox
              // checked={clientChecked(client.id)}
              // defaultChecked={cheked}
              onChange={(event) => {
                let copyArray = permissionsArray

                const have = havePermissionInArray(copyArray, energyService.dealership, energyService.state, energyService.city)
                if (have) {
                  copyArray = copyArray.filter(permission => {
                    const havePermission = permission.dealership === energyService.dealership && permission.city === energyService.city && permission.state === energyService.state
                    return !havePermission                  
                  })
                } else {
                  copyArray.push({
                    state: energyService.state,
                    city: energyService.city,
                    dealership: energyService.dealership
                  })
                }

                setPermissionsArray(copyArray)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
    
            <Typography
              variant='subtitle2'
              component='p'
            >
              {energyService.city}
              {/* {energyService.label} */}
            </Typography>
          </Box>
        )
      })
    }
  }

  return (
    <Modal
      title={title}
      setShowModal={setViewModal}
      >
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // flexWrap: 'wrap',
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

      </Box>
      
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          '& > :not(style)': { m: 1, width: '25ch' },
          
          maxHeight: 200,
          overflowY: 'scroll'
        }}
        noValidate
        autoComplete="off"
      >
        {renderCities()}
      </Box>

      <div className={styles.actions_container}>
        <Button variant="contained" color="warning" onClick={() => update()}>Atualizar</Button>
      </div>
    </Modal>
  )
}