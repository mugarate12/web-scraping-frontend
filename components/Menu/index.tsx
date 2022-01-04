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
  BrightnessHigh,
  Description,
  ExitToApp,
  VpnKey,
  Notifications,
  Person,
  PersonalVideo
} from '@material-ui/icons'

import { useMenuContext } from './../../context/menuContext'

export default function Menu() {
  const { open, setOpen } = useMenuContext()

  const [ openUsersOptions, setOpenUsersOptions ] = useState<boolean>(false)
  const [ openServicesOptions, setOpenServicesOptions ] = useState<boolean>(false)
  const [ openClientsOptions, setOpenClientsOptions ] = useState<boolean>(false)
  const [ openEnergyOptions, setOpenEnergyOptions ] = useState<boolean>(false)

  const router = useRouter()

  const toggleDrawer = (event: any, pagePath?: string) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setOpen(false)
    setOpenUsersOptions(false)
    setOpenServicesOptions(false)
    setOpenClientsOptions(false)
    setOpenEnergyOptions(false)

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
            <ListItemText primary='Criar Serviço' sx={{ marginLeft: '20px' }}/>
          </ListItem>
          
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/services/view')}
            onKeyDown={(event) => toggleDrawer(event, '/services/view')}
          >
            <ListItemText primary='Ver Serviços' sx={{ marginLeft: '20px' }}/>
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
            <ListItemText primary='Criar Usuário' sx={{ marginLeft: '20px' }}/>
          </ListItem>
          
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/users/view')}
            onKeyDown={(event) => toggleDrawer(event, '/users/view')}
          >
            <ListItemText primary='Ver Usuários' sx={{ marginLeft: '20px' }}/>
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
            <ListItemText primary='Criar Cliente' sx={{ marginLeft: '20px' }}/>
          </ListItem>
          
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/clients')}
            onKeyDown={(event) => toggleDrawer(event, '/clients')}
          >
            <ListItemText primary='Ver Clientes' sx={{ marginLeft: '20px' }}/>
          </ListItem>
        </>
      )
    }
  }
  
  function renderEnergyOptions() {
    if (openEnergyOptions) {
      return (
        <>
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/energy/create')}
            onKeyDown={(event) => toggleDrawer(event, '/energy/create')}
          >
            <ListItemText primary='Criar Monitoramento' sx={{ marginLeft: '20px' }}/>
          </ListItem>
          
          <ListItem 
            button 
            onClick={(event) => toggleDrawer(event, '/energy')}
            onKeyDown={(event) => toggleDrawer(event, '/energy')}
          >
            <ListItemText primary='Ver Serviços' sx={{ marginLeft: '20px' }}/>
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

  function goToApiPage() {
    const developmentURL = 'http://localhost:3333'
    const productionURL = String(process.env.PRODUCTION_BASE_URL)

    const goTo = process.env.NODE_ENV === 'development' ? developmentURL : productionURL

    window.open(`${goTo}/public/docs/`, '_blank')
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
            sx={{
              position: 'relative',
              width: 'auto', 
              minWidth: '250px',
              height: '100%'
            }}
            role="presentation"
          >
            <List
              sx={{
                height: '100%'
              }}
            >
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

                <ListItemText primary='Flow4Detector'/>

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

                <ListItemText primary='Clientes'/>

                {renderArrow(openClientsOptions)}
              </ListItem>

              {renderClientsOptions()}

              <ListItem 
                button
                onClick={(event) => handleOption(event, () => setOpenEnergyOptions(!openEnergyOptions))}
                onKeyDown={(event) => handleOption(event, () => setOpenEnergyOptions(!openEnergyOptions))}
                >
                <ListItemIcon>
                  <BrightnessHigh />
                </ListItemIcon>

                <ListItemText primary='Flow4Energy'/>

                {renderArrow(openEnergyOptions)}
              </ListItem>

              {renderEnergyOptions()}
              
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

              <ListItem
                sx={{
                  position: 'absolute',
                  bottom: '0px',
                  cursor: 'pointer'
                }}
                onClick={(event) => handleOption(event, () => goToApiPage())}
                onKeyDown={(event) => handleOption(event, () => goToApiPage())}
              >
                <ListItemIcon>
                  <Description />
                </ListItemIcon>

                <ListItemText primary='Documentação da API pública'/>
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