import { 
  useState,
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

import styles from './Modal.module.css'

interface Props {
  title?: string,
  setShowModal: Dispatch<SetStateAction<boolean>>,

  children: any,
}

export default function Modal({
  title,
  setShowModal,
  children
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
            justifyContent: 'space-between'
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

        <div className={styles.line}></div>

        { children }
      </div>
    </div>
  )
}