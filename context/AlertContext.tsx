import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch, 
  SetStateAction
} from 'react'

interface AlertContextInterface {
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

const alertContext = createContext<AlertContextInterface>({
  open: false,
  message: '',
  type: 'info',
  
  setOpen: () => {},
  setMessage: () => {},
  setType: () => {}
})

export default function AlertContextWrapper({
  children
}: Props) {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ message, setMessage ] = useState<string>('')
  const [ type, setType ] = useState<'error' | 'info' | 'warning' | 'success'>('info')

  return (
    <alertContext.Provider
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
    </alertContext.Provider>
  )
}

export function useAlertContext() {
  const context = useContext(alertContext)

  return context
}
