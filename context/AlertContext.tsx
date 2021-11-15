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

  setOpen: Dispatch<SetStateAction<boolean>>,
  setMessage: Dispatch<SetStateAction<string>>
}

interface Props {
  children: any
}

const DEFAULT_VALUE = {
  open: false,
  message: '',
  
  setOpen: () => {},
  setMessage: () => {}
}

const alertContext = createContext<AlertContextInterface>(DEFAULT_VALUE)

export default function AlertContextWrapper({
  children
}: Props) {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ message, setMessage ] = useState<string>('')

  return (
    <alertContext.Provider
      value={{
        open,
        message,

        setOpen,
        setMessage
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
