import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch, 
  SetStateAction
} from 'react'

interface authUserContextInterface {
  token: string,

  setToken: Dispatch<SetStateAction<string>>
}

interface Props {
  children: any
}

const DEFAULT_VALUE = {
  token: '',
  
  setToken: () => {}
}

const authUserContext = createContext<authUserContextInterface>(DEFAULT_VALUE)

export default function AuthUserContextWrapper({
  children
}: Props) {
  const [ token, setToken ] = useState<string>('')

  useEffect(() => {
    const clientSideRendering = typeof window !== "undefined"

    if (clientSideRendering) {
      const tokenLocalStorage = String(localStorage.getItem('userToken'))
      
      if (tokenLocalStorage.length > 0) {
        setToken(token)
      }
    }
  }, [])

  return (
    <authUserContext.Provider
      value={{
        token: token,

        setToken: setToken
      }}
    >
      { children }
    </authUserContext.Provider>
  )
}

export function useAuthUserContext() {
  const context = useContext(authUserContext)

  return context
}