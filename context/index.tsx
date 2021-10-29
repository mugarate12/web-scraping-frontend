import AuthUserContextWrapper from "./authUserContext"

interface Props {
  children: any
}

export default function ContextWrapper({
  children
}: Props) {
  return (
    <AuthUserContextWrapper>
      { children }
    </AuthUserContextWrapper>
  )
}