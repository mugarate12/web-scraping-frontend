import { 
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react'

import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton
} from '@material-ui/core'

import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff
} from '@material-ui/icons'

import {
  Modal
} from './../../components'

import {
  useAlert,
  useHostsPerfisOperations
} from './../../hooks'

interface Props {
  title: string,

  setViewModal: Dispatch<SetStateAction<boolean>>,
  setUpdatePerfis?: Dispatch<SetStateAction<boolean>>
}

export default function CreateHostPerfil({
  title,

  setViewModal,
  setUpdatePerfis
}: Props) {
  const alertHook = useAlert()
  const hostsPerfisOperations = useHostsPerfisOperations()

  const [ name, setName ] = useState<string>('')
  const [ user, setUser ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ url, setUrl ] = useState<string>('')
  const [ link, setLink ] = useState<string>('')

  const [ showPassword, setShowPassword ] = useState<boolean>(false)

  async function createPerfil() {
    if (!!name && !!user && !!password && !!url && !!url) {
      await hostsPerfisOperations.create({ name, user, password, url, link })
    
      if (!!setUpdatePerfis) setUpdatePerfis(true)
      setViewModal(false)
    } else {
      alertHook.showAlert('preencha todos os campos, por favor', 'error')
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
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      > 
        <TextField
          label="nome do perfil"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle sx={{ color: '#000' }} />
              </InputAdornment>
            ),
          }}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <TextField
          label="usuário"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle sx={{ color: '#000' }} />
              </InputAdornment>
            ),
          }}
          value={user}
          onChange={(event) => setUser(event.target.value)}
        />

        <TextField
          label="senha"
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
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <TextField
          label="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        
        <TextField
          label="link da planilha"
          value={link}
          onChange={(event) => setLink(event.target.value)}
        />
      </Box>

      <Button 
        variant="contained" 
        size='small'
        color='success'
        onClick={() => createPerfil()}
      >criar</Button>
    </Modal>
  )
}