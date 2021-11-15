import AlertContextWrapper from "./AlertContext"
import AuthUserContextWrapper from "./authUserContext"
import MenuContext from './menuContext'

interface Props {
  children: any
}

export default function ContextWrapper({
  children
}: Props) {
  return (
    <AlertContextWrapper>
      <AuthUserContextWrapper>
        <MenuContext>
          { children }
        </MenuContext>
      </AuthUserContextWrapper>
    </AlertContextWrapper>
  )
}