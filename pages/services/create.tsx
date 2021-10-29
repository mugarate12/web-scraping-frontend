import type { NextPage } from 'next'
import Head from 'next/head'

import {
  Box,
  Paper,
  TextField
} from '@material-ui/core'

import styles from './../../styles/Services.module.css'

const CreateService: NextPage = () => {
  return (
    <>
      <Head>
        <title>Criar serviço</title>
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
              {/* <TextField
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <AccountCircle sx={{ color: '#000' }} />
                //     </InputAdornment>
                //   ),
                // }}
                label="login"
                value={login}
                onChange={(event) => setLogin(event.target.value)}
              /> */}
            </Box>
          </Paper>
        </Box>
      </main>
    </>
  )
}

export default CreateService