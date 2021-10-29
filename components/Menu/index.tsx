import { useRouter } from 'next/router'

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
  PersonalVideo
} from '@material-ui/icons'

import { useMenuContext } from './../../context/menuContext'

export default function Menu() {
  const { open, setOpen } = useMenuContext()

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

  function renderMenu() {
    if (router.pathname !== '/') {
      return (
        <Drawer 
          anchor='top'
          open={open}
          onClose={(event) => toggleDrawer(event)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={(event) => toggleDrawer(event, '/services/create')}
            onKeyDown={(event) => toggleDrawer(event, '/services/create')}
          >
            <List>
              <ListItem button >
                <ListItemIcon>
                  <PersonalVideo />
                </ListItemIcon>

                <ListItemText primary='criar serviço'/>
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