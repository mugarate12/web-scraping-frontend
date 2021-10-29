import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch, 
  SetStateAction
} from 'react'

interface menuContextInterface {
  open: boolean,

  setOpen: Dispatch<SetStateAction<boolean>>
}

interface Props {
  children: any
}

const DEFAULT_VALUE = {
  open: false,

  setOpen: () => {}
}

const menuContext = createContext<menuContextInterface>(DEFAULT_VALUE)

export default function MenuContextWrapper({
  children
}: Props) {
  const [ open, setOpen ] = useState<boolean>(false)

  return (
    <menuContext.Provider
      value={{
        open: open,

        setOpen: setOpen
      }}
    >
      { children }
    </menuContext.Provider>
  )
}

export function useMenuContext() {
  const context = useContext(menuContext)

  return context
}