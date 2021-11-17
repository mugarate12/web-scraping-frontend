import { 
  useState,
  Dispatch,
  SetStateAction
} from 'react'

import {
  Button,
  Box,
  MenuItem,
  Select,
  IconButton,
  InputAdornment,
  Typography,
  TextField
} from '@material-ui/core'

import {
  AccountCircle,
  Visibility,
  VisibilityOff
} from '@material-ui/icons'

import {
  useAlert,
  usePublicAccessClientsOperations
} from './../../hooks'

import { clientInformationData } from './../../interfaces/publicAccessClients'

import styles from './EditClientModal.module.css'

interface Props {
  clientID: number,
  name: string,
  setUpdateRows: Dispatch<SetStateAction<boolean>>,
  setShowUpdateClientModal: Dispatch<SetStateAction<boolean>>,
}

export default function EditClientModal({
  clientID,
  name,
  setUpdateRows,
  setShowUpdateClientModal
}: Props) {
  const alertHook = useAlert()
  const publicAccessClientsOperations = usePublicAccessClientsOperations({ setUpdateState: setUpdateRows })

  const [ identifier, setIdentifier ] = useState<string>(name)

  async function updateClient() {
    const result = await publicAccessClientsOperations.update(clientID, { identifier })

    if (result) {
      alertHook.showAlert('cliente atualizado com sucesso', 'success')

      setShowUpdateClientModal(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h6" component="p">
          Atualizar cliente
        </Typography>

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
        </Box>

        <div className={styles.actions_container}>
          <Button variant="contained" color="warning" onClick={() => updateClient()}>Atualizar</Button>
        </div>
      </div>
    </div>
  )
}