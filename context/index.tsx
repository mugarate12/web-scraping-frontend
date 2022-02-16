import AlertContextWrapper from "./AlertContext"
import AuthUserContextWrapper from "./authUserContext"
import MenuContext from './menuContext'
import NotificationContextWrapper from './NotificationContext'

interface Props {
  children: any
}

export default function ContextWrapper({
  children
}: Props) {
  return (
    <AlertContextWrapper>
      <NotificationContextWrapper>
        <AuthUserContextWrapper>
          <MenuContext>
            { children }
          </MenuContext>
        </AuthUserContextWrapper>
      </NotificationContextWrapper>
    </AlertContextWrapper>
  )
}