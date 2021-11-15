import { useRouter } from 'next/router'
import {
  useState
} from 'react'

import {
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'

import {
  ArrowUpward,
  ArrowDownward,
  ExitToApp,
  VpnKey,
  Person,
  PersonalVideo
} from '@material-ui/icons'

import { useMenuContext } from './../../context/menuContext'

export default function Menu() {
  const { open, setOpen } = useMenuContext()

  const [ openUsersOptions, setOpenUsersOptions ] = useState<boolean>(false)
  const [ openServicesOptions, setOpenServicesOptions ] = useState<boolean>(false)
  const [ openClientsOptions, setOpenClientsOptions ] = useState<boolean>(false)

  const router = useRouter()

  const toggleDrawer = (event: any, pagePath?: string) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setOpen(false)
    setOpenUsersOptions(false)
    setOpenServicesOptions(false)

    if (!!pagePath) {
      router.push(pagePath)
    }
  }

  function handleOption(event: any, func: Function) {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    func()
  }

  function renderArrow(state: boolean) {
    if (state) {
      return (
        <ArrowUpward />
        ) 
      } else {
        return (
        <ArrowDownward />
      )
    }
  }

  function renderServicesOptions() {
    if (openServicesOptions) {
      return (
        <>
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/services/create')}
            onKeyDown={(event) => toggleDrawer(event, '/services/create')}
          >
            <ListItemText primary='criar serviço' sx={{ marginLeft: '20px' }}/>
          </ListItem>
          
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/services/view')}
            onKeyDown={(event) => toggleDrawer(event, '/services/view')}
          >
            <ListItemText primary='ver serviços' sx={{ marginLeft: '20px' }}/>
          </ListItem>
        </>
      )
    }
  }

  function renderUsersOptions() {
    if (openUsersOptions) {
      return (
        <>
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/users/create')}
            onKeyDown={(event) => toggleDrawer(event, '/users/create')}
          >
            <ListItemText primary='criar usuário' sx={{ marginLeft: '20px' }}/>
          </ListItem>
          
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/users/view')}
            onKeyDown={(event) => toggleDrawer(event, '/users/view')}
          >
            <ListItemText primary='ver usuários' sx={{ marginLeft: '20px' }}/>
          </ListItem>
        </>
      )
    }
  }
  
  function renderClientsOptions() {
    if (openClientsOptions) {
      return (
        <>
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/clients/create')}
            onKeyDown={(event) => toggleDrawer(event, '/clients/create')}
          >
            <ListItemText primary='criar cliente' sx={{ marginLeft: '20px' }}/>
          </ListItem>
          
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/clients')}
            onKeyDown={(event) => toggleDrawer(event, '/clients')}
          >
            <ListItemText primary='Ver clientes' sx={{ marginLeft: '20px' }}/>
          </ListItem>
        </>
      )
    }
  }

  function exitApp() {
    localStorage.removeItem('userToken')
    setOpen(false)
    router.push('/')
  }

  function renderMenu() {
    if (router.pathname !== '/') {
      return (
        <Drawer 
          anchor='left'
          open={open}
          onClose={(event) => toggleDrawer(event)}
        >
          <Box
            sx={{ width: 'auto', minWidth: '200px' }}
            role="presentation"
          >
            <List>
              <ListItem 
                button
                onClick={(event) => handleOption(event, () => setOpenUsersOptions(!openUsersOptions))}
                onKeyDown={(event) => handleOption(event, () => setOpenUsersOptions(!openUsersOptions))}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>

                <ListItemText primary='Usuários'/>

                {renderArrow(openUsersOptions)}
              </ListItem>
              
              {renderUsersOptions()}
              
              <ListItem 
                button
                onClick={(event) => handleOption(event, () => setOpenServicesOptions(!openServicesOptions))}
                onKeyDown={(event) => handleOption(event, () => setOpenServicesOptions(!openServicesOptions))}
                >
                <ListItemIcon>
                  <PersonalVideo />
                </ListItemIcon>

                <ListItemText primary='Serviços'/>

                {renderArrow(openServicesOptions)}
              </ListItem>

              {renderServicesOptions()}
             
              <ListItem 
                button
                onClick={(event) => handleOption(event, () => setOpenClientsOptions(!openClientsOptions))}
                onKeyDown={(event) => handleOption(event, () => setOpenClientsOptions(!openClientsOptions))}
                >
                <ListItemIcon>
                  <VpnKey />
                </ListItemIcon>

                <ListItemText primary='Clients'/>

                {renderArrow(openClientsOptions)}
              </ListItem>

              {renderClientsOptions()}
              
              <ListItem 
                button
                onClick={(event) => handleOption(event, () => exitApp())}
                onKeyDown={(event) => handleOption(event, () => exitApp())}
                >
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>

                <ListItemText primary='Sair'/>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )
    }
  }

  return (
    <>
      {renderMenu()}
    </>
  )
}