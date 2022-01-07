import { 
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react'

import {
	Autocomplete,
  Button,
  Box,
  Checkbox,
  InputAdornment,
  Typography,
  TextField
} from '@material-ui/core'

import {
  AccountCircle
} from '@material-ui/icons'

import {
	ActionConfirmation
} from './../../components'

import {
  useAlert,
	useDealershipsAndUpdateTimes,
	useEnergyOperations,
  usePublicAccessClientsOperations
} from './../../hooks'

import {
  Modal
} from './../../components'

import styles from './EditEnergyModal.module.css'

interface Props {
	id: number,
	title: string,
	updateTime: number,
	dealership: string,
  state: string,
  city: string,

	clientID: number,
	searchID: number,

	setViewModal: Dispatch<SetStateAction<boolean>>,
	setUpdateServices: Dispatch<SetStateAction<boolean>>
}

export default function EditEnergyModal({
	id,
	title,
	updateTime,

	clientID,
	searchID,
	dealership,
	state,
	city,

	setViewModal,
	setUpdateServices
}: Props) {
	const [ updateTimeField, setUpdateTime ] = useState<number>(updateTime)

	const dealershipsAndUpdateTimes = useDealershipsAndUpdateTimes()
	const energyOperations = useEnergyOperations({})
	const publicAccessClientsOperations = usePublicAccessClientsOperations({})

	const [ showUpdatePermissionModal, setShowUpdatePermissionModal ] = useState<boolean>(false)
	const [ showUpdateModal, setShowUpdateModal ] = useState<boolean>(false)
	const [ showRemoveModal, setShowRemoveModal ] = useState<boolean>(false)

	const [ confirmUpdatePermission, setConfirmUpdatePermission ] = useState<boolean>(false)
	const [ confirmUpdate, setConfirmUpdate ] = useState<boolean>(false)
	const [ confirmDelete, setConfirmDelete ] = useState<boolean>(false)

	function formatOptions(payload: Array<{ value: string, label: string}>) {
    const formatted = payload.map(stateValue => {
      const firstLetter = stateValue.label[0].toUpperCase()
      const option = stateValue.label

      return {
        firstLetter,
        option,
        ...stateValue
      }
    })

    return formatted
  }

	async function updatePermission() {
		const result = await publicAccessClientsOperations.removePermissions(clientID, {
			permissionsArray: [{
				city,
				dealership,
				state
			}]
		})

		if (result) {
			setUpdateServices(true)
			setViewModal(false)
		} else {
			setConfirmUpdatePermission(false)
		}
	}

	async function update() {
		const result = await energyOperations.update({ id: searchID, updateTime: updateTimeField })
	
		if (result) {
			setUpdateServices(true)
			setViewModal(false)
		}
	}

	async function remove() {
		const result = await energyOperations.remove(id)

		if (result) {
			setUpdateServices(true)
			setViewModal(false)
		} else {
			setConfirmDelete(false)
		}
	}

	useEffect(() => {
		if (confirmUpdate) {
			update()
		}
	}, [ confirmUpdate ])

	useEffect(() => {
		if (confirmUpdatePermission) {
			updatePermission()
		}
	}, [ confirmUpdatePermission ])

	useEffect(() => {
		if (confirmDelete) {
			remove()
		}
	}, [ confirmDelete ])

	function renderShowConfirmUpdatePermission() {
		if (showUpdatePermissionModal) {
			return (
				<ActionConfirmation
					title='quer retirar o acesso deste clinte a esta cidade?'
					setConfirmationAction={setConfirmUpdatePermission}
					setShowModal={setShowUpdatePermissionModal}
				/>
			)
		}
	}

	return (
		<>
			{renderShowConfirmUpdatePermission()}

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

					<Autocomplete
						// value={autoCompleteValue}
						onChange={(event, newValue) => {
							if (!!newValue) {
								setUpdateTime(Number(newValue.value))
							}
						}}
						options={formatOptions(dealershipsAndUpdateTimes.updatesTimes).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
						// groupBy={(option) => option.firstLetter}
						// getOptionLabel={(option) => option.option}
						sx={{
							width: 200
						}}
						renderInput={(params) => <TextField {...params} label="Tempo de atualizaçao" />}
					/>

				</Box>

				<div className={styles.actions_container}>
					<Button variant="contained" color="error" onClick={() => setShowUpdatePermissionModal(true)}>Deletar apenas esta</Button>
					<Button variant="contained" color="error" onClick={() => setShowRemoveModal(true)}>Deletar todos</Button>
					<Button variant="contained" color="warning" onClick={() => update()}>Atualizar</Button>
				</div>
			</Modal>
		</>
	)
}