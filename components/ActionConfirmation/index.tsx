import {
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import {
  Box,
  Button,
  IconButton,
  Typography
} from '@material-ui/core'

import {
  Close
} from '@material-ui/icons'

import styles from './ActionConfirmation.module.css'

interface Props {
  title: string,
  setConfirmationAction: Dispatch<SetStateAction<boolean>>,
  setShowModal: Dispatch<SetStateAction<boolean>>

}

export default function ActionConfirmation({
  title, 
  setConfirmationAction,
  setShowModal
}: Props) {
  function closeModal() {
    setShowModal(false)
  }

  function closeModalWithEscapeKey(event: any) {
    if(event.keyCode === 27) {
      closeModal()
    }
  }

  useEffect(() => {
    const clientSideRendering = typeof window !== "undefined"

    if (clientSideRendering) {
      document.addEventListener("keydown", closeModalWithEscapeKey, false);
    }
  }, [])

  function handleConfirmation(confirmation: boolean) {
    setConfirmationAction(confirmation)
    setShowModal(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Box
          component="div"
          sx={{
            width: '100%',

            padding: '5px 0px',
            
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" component="p">
            {title}
          </Typography>

          <IconButton 
            aria-label='fechar'
            onClick={() => closeModal()}
          >
            <Close />
          </IconButton>
        </Box>

        <Box
          component="div"
          sx={{
            width: '100%',

            padding: '5px 0px',
            
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Button variant="text" color="info" onClick={() => handleConfirmation(false)}>cancelar</Button>
          <Button variant="contained" color="error" onClick={() => handleConfirmation(true)}>confirmar</Button>
        </Box>
      </div>   
    </div>
  )
}