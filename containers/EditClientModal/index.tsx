import { 
  useState,
  Dispatch,
  SetStateAction
} from 'react'

import {
  Button,
  Box,
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
  setUpdateRows: Dispatch<SetStateAction<boolean>>,
  setShowModal: Dispatch<SetStateAction<boolean>>,
}

export default function EditClientModal({
  clientID,
  name,
  setUpdateRows,
  setShowModal
}: Props) {
  const alertHook = useAlert()
  const publicAccessClientsOperations = usePublicAccessClientsOperations({ setUpdateState: setUpdateRows })

  const [ identifier, setIdentifier ] = useState<string>(name)

  async function updateClient() {
    const result = await publicAccessClientsOperations.update(clientID, { identifier })

    if (result) {
      alertHook.showAlert('cliente atualizado com sucesso', 'success')

      setShowModal(false)
    }
  }

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
      </Box>

      <div className={styles.actions_container}>
        <Button variant="contained" color="warning" onClick={() => updateClient()}>Atualizar</Button>
      </div>
    </Modal>
  )
}