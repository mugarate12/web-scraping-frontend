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
  Typography,
  TextField
} from '@material-ui/core'

import {
  useServicesOperations
} from './../../hooks'

import styles from './EditServiceModal.module.css'

interface UpdateRowData {
  id: number,
  serviceName: string,
  updateTime: number
}

interface Props {
  id: number,
  serviceName: string,
  updateTime: number,
  setUpdateRowData: Dispatch<SetStateAction<UpdateRowData | undefined>>
}

export default function EditServiceModal({
  id,
  serviceName,
  updateTime,
  setUpdateRowData
}: Props) {
  const servicesOperations = useServicesOperations()

  const [ time, setTime ] = useState<number>(updateTime)

  async function handleUpdateTime() {
    const result = await servicesOperations.updateService(id, time)

    if (result) {
      alert('serviço atualizado com sucesso!')

      setUpdateRowData(undefined)
    }
  }

  async function handleDelete() {
    const result = await servicesOperations.removeService(id)

    if (result) {
      alert('serviço deletado com sucesso!')

      setUpdateRowData(undefined)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h6" component="p">
          {serviceName}
        </Typography>

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
          <Button variant="text" onClick={() => setUpdateRowData(undefined)}>Cancelar</Button>

          <Button variant="contained" color="error" onClick={() => handleDelete()}>Remover</Button>
          <Button variant="contained" color="success" onClick={() => handleUpdateTime()}>Editar</Button>
        </div>

      </div>
    </div>
  )
}