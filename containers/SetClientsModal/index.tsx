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
  usePublicAccessClients
} from './../../hooks'

interface Props {
  title: string,
  clientsIDs: Array<number>,
  setClientsIDs: Dispatch<SetStateAction<Array<number>>>,
  setViewModal: Dispatch<SetStateAction<boolean>>
}

export default function SetClientsModal({
  title,
  clientsIDs,
  setClientsIDs,
  setViewModal
}: Props) {
  const clients = usePublicAccessClients({})

  function clientChecked(id: number) {
    return clientsIDs.includes(id)
  }

  function selectClient(id: number) {
    let copyArray = clientsIDs

    if (clientsIDs.includes(id)) {
      copyArray = copyArray.filter(clientID => clientID !== id)
    } else {
      copyArray.push(id)
    }

    setClientsIDs(copyArray)
  }

  function renderClients() {
    return clients.map((client) => {
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
            defaultChecked={clientChecked(client.id)}
            onChange={(event) => selectClient(client.id)}
            inputProps={{ 'aria-label': 'controlled' }}
          />

          <Typography
            variant='subtitle2'
            component='p'
          >
            {client.identifier}
          </Typography>
        </Box>
      )
    })
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
          flexDirection: 'row',
          flexWrap: 'wrap',
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        {renderClients()}
      </Box>
    </Modal>
  )
}