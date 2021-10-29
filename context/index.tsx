import AuthUserContextWrapper from "./authUserContext"
import MenuContext from './menuContext'

interface Props {
  children: any
}

export default function ContextWrapper({
  children
}: Props) {
  return (
    <AuthUserContextWrapper>
      <MenuContext>
        { children }
      </MenuContext>
    </AuthUserContextWrapper>
  )
}