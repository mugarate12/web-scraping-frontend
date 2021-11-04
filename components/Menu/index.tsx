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
  PersonalVideo
} from '@material-ui/icons'

import { useMenuContext } from './../../context/menuContext'

export default function Menu() {
  const { open, setOpen } = useMenuContext()

  const [ openServicesOptions, setOpenServicesOptions ] = useState<boolean>(false)

  const router = useRouter()

  const toggleDrawer = (event: any, pagePath?: string) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setOpen(false)
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
            // onClick={(event) => toggleDrawer(event, '/services/create')}
            // onKeyDown={(event) => toggleDrawer(event, '/services/create')}
          >
            <List>
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