import {
  Alert as AlertMUI,
  Button,
  IconButton,
  Snackbar
} from '@material-ui/core'

import {
  Close
} from '@material-ui/icons'

import { useNotificationContext } from './../../context/NotificationContext'

export default function Notification() {
  const { 
    open,
    message,
    type,
    setOpen
  } = useNotificationContext()

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        FECHAR
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={open}
        autoHideDuration={1000000}
        onClose={handleClose}
        // message={message}
        action={action}
      >
        <AlertMUI onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </AlertMUI>
      </Snackbar>
    </div>
  )
}