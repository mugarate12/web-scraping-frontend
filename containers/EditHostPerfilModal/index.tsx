import { 
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react'

import {
  Button,
  Box,
  TextField
} from '@material-ui/core'

import {
  useHostsPerfisOperations
} from './../../hooks'

import {
  Modal
} from './../../components'

import styles from './EditHostPerfilModal.module.css'

interface Props {
	title: string,
  
  id: number,
  name: string,
  user: string,
  password: string,
  url: string,
  link: string,

	setViewModal: Dispatch<SetStateAction<boolean>>,
	setUpdatePerfis: Dispatch<SetStateAction<boolean>>,
}

export default function EditHostPerfilModal({
	title,

  id,
  name,
  user,
  password,
  url,
  link,

	setViewModal,
  setUpdatePerfis
}: Props) {
  const hostsPerfisOperations = useHostsPerfisOperations()

  const [ updateName, setUpdateName ] = useState<string>(name)
  const [ updateUser, setUpdateUser ] = useState<string>(user)
  const [ updatePassword, setUpdatePassword ] = useState<string>(password)
  const [ updateURL, setUpdateURL ] = useState<string>(url)
  const [ updateLink, setUpdateLink ] = useState<string>(link)

  async function update() {
    const result = await hostsPerfisOperations.update({
      id, 
      payload: {
        name: updateName,
        user: updateUser,
        password: updatePassword,
        url: updateURL,
        link: updateLink
      }
    })

    if (result) {
      setUpdatePerfis(true)
      setViewModal(false)
    }
  }

	return (
		<>
			<Modal
				title={title}
				setShowModal={setViewModal}
			>
				<Box
					component="form"
					sx={{
						display: 'flex',
						flexDirection: 'column',
						'& > :not(style)': { m: 1, width: '25ch' },
					}}
					noValidate
					autoComplete="off"
				>
          <TextField
            label="name"
            value={updateName}
            onChange={(event) => setUpdateName(event.target.value)}
          />
          
          <TextField
            label="usuário"
            value={updateUser}
            onChange={(event) => setUpdateUser(event.target.value)}
          />
          
          <TextField
            label="senha"
            value={updatePassword}
            onChange={(event) => setUpdatePassword(event.target.value)}
          />
          
          <TextField
            label="url"
            value={updateURL}
            onChange={(event) => setUpdateURL(event.target.value)}
          />
          
          <TextField
            label="link"
            value={updateLink}
            onChange={(event) => setUpdateLink(event.target.value)}
          />
				</Box>

				<div className={styles.actions_container}>
					<Button variant="contained" color="warning" onClick={() => update()}>Atualizar</Button>
				</div>
			</Modal>
		</>
	)
}