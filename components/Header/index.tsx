import { useRouter } from 'next/router'

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core'

import {
  AccountCircle,
  Menu
} from '@material-ui/icons'

import {
  useToken
} from './../../hooks'

import { useMenuContext } from './../../context/menuContext'

export default function Header() {
  const { setOpen } = useMenuContext()

  const router = useRouter()
  const token = useToken()

  function renderAuthenticatedIcon() {
    if (token.length > 0) {
      return (
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          // onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      )
    }
  }

  function renderTitle() {
    if (router.pathname.includes('services')) {
      return 'Serviços'
    } else if (router.pathname.includes('users')) {
      return 'Usuários'
    }
  }

  function renderHeader() {
    if (router.pathname !== '/') {
      return (
        <Box
          sx={{
            flexGrow: 1 
          }}
        >
          <AppBar 
            position="fixed"
            sx={{
              backgroundColor: '#333'
            }}
          >
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setOpen(true)}
              >
                <Menu />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {renderTitle()}
              </Typography>
              {renderAuthenticatedIcon()}
            </Toolbar>
          </AppBar>
        </Box>
      )
    }
  }

  return (
    <>
      {renderHeader()}
    </>
  )
}