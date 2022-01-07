import { 
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react'
import moment from 'moment'

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
  AccountCircle
} from '@material-ui/icons'

import {
  useAlert,
  usePublicAccessClientsOperations
} from './../../hooks'

import {
  Modal
} from './../../components'

import styles from './EditClientModal.module.css'

interface Props {
  clientID: number,
  name: string,
  expirationTime: string,
  setUpdateRows: Dispatch<SetStateAction<boolean>>,
  setShowModal: Dispatch<SetStateAction<boolean>>,
}

export default function EditClientModal({
  clientID,
  name,
  expirationTime,
  setUpdateRows,
  setShowModal
}: Props) {
  const alertHook = useAlert()
  const publicAccessClientsOperations = usePublicAccessClientsOperations({ setUpdateState: setUpdateRows })

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

  const [ identifier, setIdentifier ] = useState<string>(name)
  const [ inputExpirationTimeValue, setInputExpirationTimeValue ] = useState(expirationTimeOptions[0])
  const [ inputExpirationTime, setExpirationTime ] = useState<string>('')
  const [ permissions, setPermissions ] = useState<Array<string>>([])

  const [ flow4Detector, setFlow4Detector ] = useState<boolean>(false)
  const [ flow4Energy, setFlow4Energy ] = useState<boolean>(false)

  async function updateClient() {
    const result = await publicAccessClientsOperations.update(clientID, { identifier, flow4Energy, flow4Detector, expiration_time: inputExpirationTime })

    if (result) {
      alertHook.showAlert('cliente atualizado com sucesso', 'success')

      setShowModal(false)
      setUpdateRows(true)
    }
  }

  async function getPermissions() {
    await publicAccessClientsOperations.getPermissions(clientID)
      .then((permissions) => {
        setPermissions(permissions)
      })
  }

  useEffect(() => {
    if (!!clientID) {
      getPermissions()
    }
  }, [ clientID ])

  useEffect(() => {
    if (permissions.includes('ACCESS_API_FLOW4ENERGY_DATA')) {
      console.log('object');
      setFlow4Energy(true)
    }

    if (permissions.includes('ACCESS_API_FLOW4DETECTOR_DATA')) {
      setFlow4Detector(true)
    }
  }, [ permissions ])

  return (
    <Modal
      title='Atualizar cliente'
      setShowModal={setShowModal}
    >
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle sx={{ color: '#000' }} />
              </InputAdornment>
            )
          }}
          type='text'
          label="identificador"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />

        <Autocomplete
          value={inputExpirationTimeValue}
          onChange={(event, newValue) => {
            if (!!newValue) {
              setExpirationTime(newValue.value)
              setInputExpirationTimeValue(newValue)
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

      <div className={styles.actions_container}>
        <Button variant="contained" color="warning" onClick={() => updateClient()}>Atualizar</Button>
      </div>
    </Modal>
  )
}