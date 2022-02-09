import {
  useAlert
} from './'

import { apiDetector } from './../config'

interface createHostPerfilInterface {
  name: string,
  user: string,
  password: string,
  url: string,
  link: string
}

interface updatePayloadInterface {
  name?: string,
  user?: string,
  password?: string,
  url?: string,
  link?: string
}

interface updateHostPerfilInterface {
  id: number,

  payload: updatePayloadInterface
}

interface deleteHostPerfilInterface {
  id: number
}

export default function useHostsPerfisOperations() {
  const alertHook = useAlert()

  async function create({ name, user, password, url, link }: createHostPerfilInterface) {
    await apiDetector.post('/hostperfil', {
      name, user, password, url, link
    })
      .then(() => {
        alertHook.showAlert('perfil criado com sucesso!', 'success')
      })
      .catch(() => {
        alertHook.showAlert('não foi possível criar um perfil, por favor, verifique se existe um perfil com mesmo nome e tente novamente!', 'error')
      })
  }

  async function update({ id, payload }: updateHostPerfilInterface) {
    let updatePayload: updatePayloadInterface = {}
    let result = false
  
    if (payload.user) updatePayload.user = payload.user
    if (payload.password) updatePayload.password = payload.password
    if (payload.name) updatePayload.name = payload.name
    if (payload.url) updatePayload.url = payload.url
    if (payload.link) updatePayload.link = payload.link

    await apiDetector.put(`/hostperfil/${id}`, updatePayload)
      .then(() => {
        alertHook.showAlert('perfil atualizado com sucesso!', 'success')
        result = true
      })
      .catch(() => {
        alertHook.showAlert('não foi possível atualizar um perfil, por favor, tente novamente!', 'error')
      })

    return result
  }

  async function remove({ id }: deleteHostPerfilInterface) {
    let result = false

    await apiDetector.delete(`/hostperfil/${id}`)
      .then(() => {
        alertHook.showAlert('perfil deletado com sucesso!', 'success')
        result = true
      })
      .catch(() => {
        alertHook.showAlert('não foi possível deletado o perfil, por favor, tente novamente!', 'error')
      })

    return result
  }

  return {
    create,
    update,
    remove
  }
}