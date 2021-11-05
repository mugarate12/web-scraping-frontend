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
  Lock,
  Visibility,
  VisibilityOff
} from '@material-ui/icons'

import {
  useUsersOperations
} from './../../hooks'

import styles from './EditUsersModal.module.css'

interface UpdateRowData {
  id: number,
  login: string
}

interface Props {
  id: number,
  login: string,
  setUpdateRowData: Dispatch<SetStateAction<UpdateRowData | undefined>>,
  setUpdateRows: Dispatch<SetStateAction<boolean>>
}

export default function EditUsersModal({
  id,
  login,
  setUpdateRowData,
  setUpdateRows
}: Props) {
  const usersOperations = useUsersOperations()

  const [ password, setPassword ] = useState<string>('')
  const [ showPassword, setShowPassword ] = useState<boolean>(false)

  async function handleUpdate() {
    const result = await usersOperations.updateUser(id, password)

    if (result) {
      alert('serviço atualizado com sucesso!')

      setUpdateRows(true)
      setUpdateRowData(undefined)
    }
  }

  async function handleDelete() {
    const result = await usersOperations.removeUser(id)

    if (result) {
      alert('serviço deletado com sucesso!')

      setUpdateRows(true)
      setUpdateRowData(undefined)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h6" component="p">
          {login}
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
                  <Lock sx={{ color: '#000' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(event) => {
                      event.preventDefault()
                    }}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            type={showPassword ? 'text' : 'password'}
            label="senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Box>

        <div className={styles.actions_container}>
          <Button variant="text" onClick={() => setUpdateRowData(undefined)}>Cancelar</Button>

          <Button variant="contained" color="error" onClick={() => handleDelete()}>Remover</Button>
          <Button variant="contained" color="success" onClick={() => handleUpdate()}>Editar</Button>
        </div>

      </div>
    </div>
  )
}