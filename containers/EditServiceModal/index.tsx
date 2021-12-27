import { 
  useState,
  Dispatch,
  SetStateAction
} from 'react'

import {
  Button,
  Box,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core'

import {
  Modal
} from './../../components'

import {
  useServicesOperations
} from './../../hooks'

import styles from './EditServiceModal.module.css'

interface UpdateRowData {
  id: number,
  serviceName: string,
  updateTime: number,
  able: number
}

interface Props {
  id: number,
  serviceName: string,
  updateTime: number,
  able: number,
  setUpdateRowData: Dispatch<SetStateAction<UpdateRowData | undefined>>,
  setUpdateRows: Dispatch<SetStateAction<boolean>>,
  setShowModal: Dispatch<SetStateAction<boolean>>,
}

export default function EditServiceModal({
  id,
  serviceName,
  updateTime,
  able,
  setUpdateRowData,
  setUpdateRows,
  setShowModal
}: Props) {
  const servicesOperations = useServicesOperations()

  const [ time, setTime ] = useState<number>(updateTime)
  const [ ableService, setAbleService ] = useState<number>(able)

  async function handleUpdateTime() {
    const result = await servicesOperations.updateService(id, time)

    if (result) {
      alert('serviço atualizado com sucesso!')

      setUpdateRows(true)
      setUpdateRowData(undefined)
    }
  }

  async function handleDelete() {
    const result = await servicesOperations.removeService(id)

    if (result) {
      alert('serviço deletado com sucesso!')

      setUpdateRows(true)
      setUpdateRowData(undefined)
    }
  }

  return (
    <Modal
      title={serviceName}
      setShowModal={setShowModal}
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
        <Select
          value={time}
          onChange={(event) => setTime(Number(event.target.value))}
        >
          <MenuItem value={1}>1 minuto</MenuItem>
          <MenuItem value={3}>3 minutos</MenuItem>
          <MenuItem value={5}>5 minutos</MenuItem>
          <MenuItem value={10}>10 minutos</MenuItem>
          <MenuItem value={15}>15 minutos</MenuItem>
        </Select>
      </Box>

      <div className={styles.actions_container}>
        <Button variant="contained" color="error" onClick={() => handleDelete()}>Remover</Button>
        <Button variant="contained" color="success" onClick={() => handleUpdateTime()}>Editar</Button>
      </div>
    </Modal>
  )
}