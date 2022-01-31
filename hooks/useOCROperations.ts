import {
  useAlert
} from './'

import { apiEnergy } from './../config'

export default function useOCROperations() {
  const alertHook = useAlert()

  async function addPermission(permissionsArray: Array<{
    client_FK: number, 
    state: string, 
    city: string,
    service: string
  }>) {
    await apiEnergy.post('/ocr/permission/add', {
      permissions: permissionsArray
    })
      .then(() => {
        alertHook.showAlert('permissões adicionadas', 'success')
      })
      .catch(error => {
        alertHook.showAlert('erro ao adicionar permissões', 'error')
      })
  }

  async function removePermission(permissionsArray: Array<{
    client_FK: number, 
    state: string, 
    city: string,
    service: string
  }>) {
    await apiEnergy.post('/ocr/permission/remove', {
      permissions: permissionsArray
    })
      .then(() => {
        alertHook.showAlert('permissões removidas', 'success')
      })
      .catch(error => {
        alertHook.showAlert('erro ao remover permissões', 'error')
      })
  }

  async function updateServiceAble(state: string, city: string, service: string, able: number) {
    await apiEnergy.put('/ocr/update/able', {
      state,
      city,
      service,
      able
    })
      .then(() => {
        alertHook.showAlert('Serviço atualizado com sucesso!', 'success')
      })
      .catch(() => {
        alertHook.showAlert('Erro ao atualizar serviço, por favor, tente novamente!', 'error')
      })
  }
  
  return {
    addPermission,
    removePermission,
    updateServiceAble
  }
}