import Head from 'next/head'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  useEffect,
  useState
} from 'react'

import {
  Autocomplete,
  Button,
  Box,
  Checkbox,
  Paper,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core'

import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
  PersonOutlineSharp
} from '@material-ui/icons'

import {
  useAlert,
  useUsersOperations
} from './../../hooks'

interface OptionsFormatted {
  value: string,
  option: string,
  firstLetter: string
}

import styles from './../../styles/Services.module.css'

const CreateUser: NextPage = () => {
  const usersOperations = useUsersOperations()

  const alertHook = useAlert()
  const router = useRouter()

  const [ login, setLogin ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ showPassword, setShowPassword ] = useState<boolean>(false)
  const [ isAdmin, setIsAdmin ] = useState<boolean>(false)

  async function handleCreate() {
    const result = await usersOperations.createUser(login, password, isAdmin)

    if (result) {
      alertHook.showAlert('usuário criado com sucesso!', 'success')

      router.push('/users/view')
    }
  }

  return (
    <>
      <Head>
        <title>Criar Usuário</title>
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
                label="login"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: '#000' }} />
                    </InputAdornment>
                  ),
                }}
                value={login}
                onChange={(event) => setLogin(event.target.value)}
              />
              
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
              
              <Box
                component='div'
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Checkbox
                  checked={isAdmin}
                  onChange={(event) => setIsAdmin(event.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />

                <Typography
                  variant='subtitle2'
                  component='p'
                >
                  Administrador
                </Typography>
              </Box>
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
            onClick={() => handleCreate()}
          >Criar</Button>
        </Box>
      </main>
    </>
  )
}

export default CreateUser