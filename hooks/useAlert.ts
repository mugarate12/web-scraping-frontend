import { useAlertContext } from './../context/AlertContext'

export default function useAlert() {
  const {
    setOpen,
    setMessage
  } = useAlertContext()

  function showAlert(message: string) {
    setMessage(message)
    setOpen(true)
  }

  return {
    showAlert
  }
}