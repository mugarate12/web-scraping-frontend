import { useNotificationContext } from './../context/NotificationContext'

export default function useNotification() {
  const {
    setOpen,
    setMessage,
    setType
  } = useNotificationContext()

  function showNotification(
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
    showNotification
  }
}
