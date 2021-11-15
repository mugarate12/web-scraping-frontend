import {
  Button,
  IconButton,
  Snackbar
} from '@material-ui/core'

import {
  Close
} from '@material-ui/icons'

import { useAlertContext } from './../../context/AlertContext'

export default function Alert() {
  const { 
    open,
    message,
    setOpen
  } = useAlertContext()

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
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        autoHideDuration={10000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  )
}