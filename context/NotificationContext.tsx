import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch, 
  SetStateAction
} from 'react'

interface NotificationContextInterface {
  open: boolean,
  message: string,
  type: 'error' | 'info' | 'warning' | 'success',

  setOpen: Dispatch<SetStateAction<boolean>>,
  setMessage: Dispatch<SetStateAction<string>>,
  setType: Dispatch<SetStateAction<'error' | 'info' | 'warning' | 'success'>>,
}

interface Props {
  children: any
}

const NotificationContext = createContext<NotificationContextInterface>({
  open: false,
  message: '',
  type: 'info',
  
  setOpen: () => {},
  setMessage: () => {},
  setType: () => {}
})

export default function NotificationContextWrapper({
  children
}: Props) {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ message, setMessage ] = useState<string>('')
  const [ type, setType ] = useState<'error' | 'info' | 'warning' | 'success'>('info')

  return (
    <NotificationContext.Provider
      value={{
        open,
        message,
        type,

        setOpen,
        setMessage,
        setType
      }}
    >
      { children }
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)

  return context
}
