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
  TextField
} from '@material-ui/core'

import {
  AccountCircle,
  Lock,
  PersonOutlineSharp
} from '@material-ui/icons'

import { Graph } from './../components'

import {
  useAuth,
  useServices
} from './../hooks'

import styles from '../styles/Home.module.css'

interface reportDataInterface {
  x: string;
  y: number;
}

const Home: NextPage = () => {
  const services = useServices()
  const authentication = useAuth()

  moment.locale('pt-br')

  const [ login, setLogin ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')

  function normalizeData(baselineData: Array<reportDataInterface>, reportsData: Array<reportDataInterface>) {
    const data = baselineData.map((baseline, index) => {
      const x = baseline.y
      const y = reportsData[index].y

      return {
        hour: moment(baseline['x']).format('HH:mm:ss'),
        uv: x,
        pv: y
      }
    })

    return data
  }

  function renderServices() {
    return services.map((service, index) => {
      const content = service.content
      const data = normalizeData(content.baseline, content.reports)

      return (
        <Graph
          key={String(index)}
          name={service.name}
          data={data}
        />
      )
    })
  }

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
                }}
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
