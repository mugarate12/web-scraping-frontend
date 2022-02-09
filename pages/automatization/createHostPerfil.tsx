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
  IconButton,
  Checkbox,
  Paper,
  InputAdornment,
  Select,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core'

import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff
} from '@material-ui/icons'

import {
  useAlert,
  useHostsPerfisOperations
} from './../../hooks'

interface OptionsFormatted {
  value: string,
  option: string,
  firstLetter: string
}

import styles from './../../styles/Services.module.css'

const CreateHostPerfil: NextPage = () => {
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
    } else {
      alertHook.showAlert('preencha todos os campos, por favor', 'error')
    }
  }

  return (
    <>
      <Head>
        <title>Criar Cliente</title>
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
            onClick={() => createPerfil()}
          >criar</Button>
        </Box>
      </main>
    </>
  )
}

export default CreateHostPerfil