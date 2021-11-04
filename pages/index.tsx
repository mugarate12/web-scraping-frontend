import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import moment from 'moment'
import {
  useState
} from 'react'

import {
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area
} from 'recharts'

import {
  Box,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  TextField
} from '@material-ui/core'

import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
  PersonOutlineSharp
} from '@material-ui/icons'

import { 
  Graph,
  Header
} from './../components'

import {
  useAuth
} from './../hooks'

import styles from '../styles/Home.module.css'

interface reportDataInterface {
  x: string;
  y: number;
}

const Home: NextPage = () => {
  const authentication = useAuth()

  moment.locale('pt-br')

  const [ login, setLogin ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ showPassword, setShowPassword ] = useState<boolean>(false)

  return (
    <>
      <Head>
        <title>Logar usuário</title>
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
            <PersonOutlineSharp
              sx={{
                position: 'absolute',
                top: -25,
                left: 'calc(50% - 25px)',

                padding: '2px',

                fontSize: 50,

                backgroundColor: '#333',
                color: '#FFF',

                borderRadius: '50%'
              }}
            />

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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: '#000' }} />
                    </InputAdornment>
                  ),
                }}
                label="login"
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
            onClick={() => authentication.login(login, password)}
          >login</Button>
        </Box>
      </main>
    </>
  )
}

export default Home
