import { useAuthUserContext } from './../context/authUserContext'

export default function useToken() {
  const { token } = useAuthUserContext()
  
  return token
}