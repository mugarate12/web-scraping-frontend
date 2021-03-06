import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import {
  useAlert
} from './'


import { apiDetector } from './../config'

interface updatePayloadInterface {
  identifier?: string,
  expiration_time?: string,
  able?: number,
  flow4Energy?: boolean,
  flow4Detector?: boolean,
  permissionsArray?: Array<{
    dealership: string,
    state: string,
    city: string
  }>
}

interface addPermissionsPayloadInterface {
  permissionsArray: Array<{
    dealership: string,
    state: string,
    city: string
  }>
}

interface getPermissionsInterface {
  data: Array<string>
}

interface Params {
  setUpdateState?: Dispatch<SetStateAction<boolean>>
}

export default function usePublicAccessClientsOperations({
  setUpdateState
}: Params) {
  const alertHook = useAlert()

  function setToUpdateState() {
    if (!!setUpdateState) {
      setUpdateState(true)
    }
  }

  async function create(identifier: string, expirationTime: string, flow4Detector: boolean, flow4Energy: boolean) {
    const token = localStorage.getItem('userToken')

    return await apiDetector.post('/public/create', {
      identifier,
      flow4Energy: flow4Energy,
      flow4Detector: flow4Detector,
      expiration_time: expirationTime
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setToUpdateState()

        return true
      })
      .catch(error => {
        console.log(error)

        alertHook.showAlert('erro ao criar cliente, por favor, tente novamente!', 'error')

        return false
      })
  }

  async function getPermissions(clientID: number) {
    const token = localStorage.getItem('userToken')
    let permissions: Array<string> = []

    await apiDetector.get<getPermissionsInterface>(`/public/client/permissions/${clientID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        permissions = response.data.data
      })
      .catch((error) => {
        console.log(error)
      })

    return permissions
  }

  async function addPermissions(clientID: number, { permissionsArray }: addPermissionsPayloadInterface) {
    const token = localStorage.getItem('userToken')

    return await apiDetector.put(`/public/clienteKey/update/permissions/add/${clientID}`, { permissionsArray }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setToUpdateState()

        alertHook.showAlert('cliente atualizado com sucesso!', 'success')

        return true
      })
      .catch(error => {
        console.log(error)

        alertHook.showAlert('erro ao atualizar cliente, por favor, tente novamente!', 'error')

        return false
      })
  }
  
  async function removePermissions(clientID: number, { permissionsArray }: addPermissionsPayloadInterface) {
    const token = localStorage.getItem('userToken')

    return await apiDetector.put(`/public/clienteKey/update/permissions/remove/${clientID}`, { permissionsArray }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setToUpdateState()

        alertHook.showAlert('cliente atualizado com sucesso!', 'success')

        return true
      })
      .catch(error => {
        console.log(error)

        alertHook.showAlert('erro ao atualizar cliente, por favor, tente novamente!', 'error')

        return false
      })
  }

  async function update(clientID: number, { able, identifier, expiration_time, flow4Energy, flow4Detector, permissionsArray }: updatePayloadInterface) {
    const token = localStorage.getItem('userToken')
    let updatePayload: updatePayloadInterface = {}

    if (!!able) {
      updatePayload.able = able
    }

    if (!!identifier) {
      updatePayload.identifier = identifier
    }
    
    if (!!flow4Detector) {
      updatePayload.flow4Detector = flow4Detector
    }
    
    if (!!flow4Energy) {
      updatePayload.flow4Energy = flow4Energy
    }

    if (!!expiration_time) {
      updatePayload.expiration_time = expiration_time
    }

    if (!!permissionsArray) updatePayload.permissionsArray = permissionsArray

    return await apiDetector.put(`/public/update/${clientID}`, updatePayload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setToUpdateState()

        alertHook.showAlert('cliente atualizado com sucesso!', 'success')

        return true
      })
      .catch(error => {
        console.log(error)

        alertHook.showAlert('erro ao atualizar cliente, por favor, tente novamente!', 'error')

        return false
      })
  }

  async function remove(identifier: string) {
    const token = localStorage.getItem('userToken')

    return await apiDetector.delete(`/public/${identifier}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setToUpdateState()

        return true
      })
      .catch(error => {
        console.log(error)

        alertHook.showAlert('erro ao remover cliente, por favor, tente novamente!', 'error')

        return false
      })
  }

  // nfe fazenda
  async function addPermissionsToNfeFazenda(data: Array<{
    nfe_fazenda_FK: number,
    client_FK: number
  }>) {
    return await apiDetector.post('/nfefazenda/addPermissions', {
      permissions: data
    })
      .then(() => {
        alertHook.showAlert('Permiss??es adicionadas com sucesso!', 'success')

        return true
      })
      .catch(() => {
        alertHook.showAlert('Erro ao adicionar permiss??es, tente novamente', 'error')

        return false
      })
  }
  
  async function removePermissionsToNfeFazenda(data: Array<{
    nfe_fazenda_FK: number,
    client_FK: number
  }>) {
    return await apiDetector.post('/nfefazenda/removePermissions', {
      permissions: data
    })
      .then(() => {
        alertHook.showAlert('Permiss??es retiradas com sucesso!', 'success')

        return true
      })
      .catch(() => {
        alertHook.showAlert('Erro ao retirar permiss??es, tente novamente', 'error')

        return false
      })
  }
  
  return {
    create,
    update,
    remove,
    getPermissions,
    addPermissions,
    removePermissions,

    addPermissionsToNfeFazenda,
    removePermissionsToNfeFazenda
  }
}