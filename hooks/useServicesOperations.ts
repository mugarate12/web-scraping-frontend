import api from './../config/axios'

interface createServiceResponse {
  message: string
}

export default function useServicesOperations() {
  async function createService(serviceName: string, time: number) {
    if (!!serviceName && serviceName.length > 0 && !!time) {
      await api.post('/services', {
        serviceName,
        updateTime: time
      })
        .then(() => {
          alert('serviço irá começar a ser monitorado')
        })
        .catch((error) => {
          alert('algum erro inexperado aconteceu, por favor, tente novamente')
        })
    }
  }

  return {
    createService
  }
}