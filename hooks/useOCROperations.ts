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
  
  return {
    addPermission,
    removePermission
  }
}