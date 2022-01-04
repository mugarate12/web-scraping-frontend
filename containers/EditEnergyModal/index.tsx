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
	setViewModal: Dispatch<SetStateAction<boolean>>,
	setUpdateServices: Dispatch<SetStateAction<boolean>>
}

export default function EditEnergyModal({
	id,
	title,
	updateTime,
	setViewModal,
	setUpdateServices
}: Props) {
	const [ updateTimeField, setUpdateTime ] = useState<number>(updateTime)

	const dealershipsAndUpdateTimes = useDealershipsAndUpdateTimes()
	const energyOperations = useEnergyOperations({})

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

	async function update() {
		await energyOperations.update({ id, updateTime: updateTimeField })
	}

	async function remove() {
		const result = await energyOperations.remove(id)

		if (result) {
			setUpdateServices(true)
			setViewModal(false)
		}
	}

	return (
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
        <Button variant="contained" color="error" onClick={() => remove()}>Deletar</Button>
        <Button variant="contained" color="warning" onClick={() => update()}>Atualizar</Button>
      </div>
		</Modal>
	)
}