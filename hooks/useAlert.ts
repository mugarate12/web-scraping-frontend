import { useAlertContext } from './../context/AlertContext'

export default function useAlert() {
  const {
    setOpen,
    setMessage,
    setType
  } = useAlertContext()

  function showAlert(
    message: string,
    type?: 'error' | 'info' | 'warning' | 'success'
  ) {
    if (!!type) {
      setType(type)
    }

    setMessage(message)
    setOpen(true)
  }

  return {
    showAlert
  }
}