import {
  useState,
  useEffect
} from 'react'
import axios from "axios"

import { apiDetector } from './../config'

import {
  useAlert
} from './'

interface authZabbixResponseInterface {
  id: number,
  jsonrpc: string,
  result: string
}

interface getGroupHostResponseInterface {
  id: number,
  jsonrpc: string,
  result: Array<{
    groupid: number,
    name: string
  }>
}

interface geProxyResponseInterface {
  id: number,
  jsonrpc: string,
  result: Array<{
    proxyid: number,
    host: string
  }>
}

interface getTemplatesResponseInterface {
  id: number,
  jsonrpc: string,
  result: Array<{
    templateid: number,
    host: string
  }>
}

interface createHostGroupResponseInterface {
  id: number, 
  jsonrpc: string,
  result: {
    groupids: Array<string>
  }
}

interface getWorksheetRowsDataInterface {
  data: Array<Array<string>>
}

export default function useZabbix () {
  const url = 'http://localhost/zabbix/api_jsonrpc.php'
  const user = 'Admin'
  const password = 'zabbix'
  
  const alertHook = useAlert()

  function makeUrl(url: string) {
    if (url[url.length - 1] === '/') {
      url = url.slice(0, url.length - 1)
    }

    const newURL = `${url}/api_jsonrpc.php`
    
    return newURL
  }

  function validateEquipamentsWithoutSameName(worksheetData: Array<Array<string>>) {
    let validate = true
    let names: Array<string> = []

    worksheetData.forEach(row => {
      const equipamentName = row[1]

      if (names.includes(equipamentName)) {
        validate = false
      } else {
        names.push(equipamentName)
      }
    })

    return validate
  }

  function allRowsHaveAllProperties(worksheetData: Array<Array<string>>) {
    let validate = true

    worksheetData.forEach(row => {
      if (row.length < 6) {
        validate = false
      } 
    })

    return validate
  }

  function allFieldsHaveAllProperties(worksheetData: Array<Array<string>>) {
    let validate = true

    worksheetData.forEach(row => {
      row.forEach(data => {
        if (data.length === 0) {
          validate = false
        }
      })
    })

    return validate
  }

  function validateWorksheet(worksheetData: Array<Array<string>>) {
    const isEquipamentsWithoutSameName = validateEquipamentsWithoutSameName(worksheetData)
    const isAllRowsHaveAllFields = allRowsHaveAllProperties(worksheetData)
    const isFieldsNotEmpty = allFieldsHaveAllProperties(worksheetData)

    const isValidWorksheet = isEquipamentsWithoutSameName && isAllRowsHaveAllFields && isFieldsNotEmpty

    if (!isValidWorksheet) {
      alertHook.showAlert('Verifique se há equipamentos com o mesmo nome, se todas as linhas tem todos os dados necessários ou se todas as linhas estão preenchidas, por favor. Você pode verificar a informação no botão "ver planilha"', 'error')
    }

    return isValidWorksheet
  }

  async function login(url: string, user: string, password: string) {
    return await axios.post<authZabbixResponseInterface>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "user.login",
      "params": {
        "username": user,
        "password": password
      },
      "id": 1,
      "auth": null
  })
    .then(response => {
      console.log(response.data.result)
      return response.data.result
      // setToken(response.data.result)
      // console.log(response['result'])
    })
    .catch(error => {
      // console.log('axios errror', error)
      console.log(error)
      return ''
    })
  }

  async function logout(url: string, token: string) {
    await axios.post<authZabbixResponseInterface>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "user.login",
      "params": [],
      "id": 1,
      "auth": token
    })
      .then(response => {

      })
      .catch(error => {
        console.log(error)
      })
  }

  async function createHostGroup(url: string, token: string, groupName: string) {
    // const groupName = 'example group'
    let groupsIDs: Array<string> = []

    await axios.post<createHostGroupResponseInterface>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "hostgroup.create",
      "params": {
        name: groupName
      },
      "id": 1,
      "auth": token
    })
      .then(response => {
        // console.log(response.data.result.groupids)
        groupsIDs = response.data.result.groupids
      })
      .catch(error => {
        console.log(error)
      })

    return groupsIDs
  }

  async function getGroupHost(url: string, token: string) {
    let result: Array<{
      groupid: number,
      name: string
    }> = []
    
    await axios.post<getGroupHostResponseInterface>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "hostgroup.get",
      "params": {
        'output': ['groupid', 'name']
      },
      "id": 1,
      "auth": token
    })
      .then(response => {
        result = response.data.result
      })
      .catch(error => {
        console.log(error)
      })

    return result
  }

  async function getProxy(url: string, token: string) {
    let content: Array<{
      proxyid: number,
      host: string
    }> = []

    await axios.post<geProxyResponseInterface>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "proxy.get",
      "params": {
        'output': ['host', 'proxyid']
      },
      "id": 1,
      "auth": token
    })
      .then(response => {
        content = response.data.result
      })
      .catch(error => {
        console.log(error)
      })

    return content
  }

  async function getTemplates(url: string, token: string) {
    let content:  Array<{
      templateid: number,
      host: string
    }> = []
    
    await axios.post<getTemplatesResponseInterface>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "template.get",
      "params": {
        'output': ['host', 'templateid']
      },
      "id": 1,
      "auth": token
    })
      .then(response => {
        content = response.data.result
      })
      .catch(error => {
        console.log(error)
      })

    return content
  }

  async function getWorksheetRowsData(worksheetLink: string) {
    let result: Array<Array<string>> = []
    // https://docs.google.com/spreadsheets/d/1gy-tg3lNgEVJtj_UTVJ5x_6-3PynpZaA3dL8MftGFDA/edit?usp=sharing

    const firstLetterOfLinkID = worksheetLink.indexOf('/d/') + 3
    let cropLink = worksheetLink.slice(firstLetterOfLinkID, worksheetLink.length)

    let lastLetterOfLinkID = firstLetterOfLinkID
    for (let index = 0; index < cropLink.length; index++) {
      const letter = cropLink[index]
      
      if (letter !== '/') {
        lastLetterOfLinkID += 1
      } else {
        break
      }
    }

    const splitWorksheetLink = worksheetLink.split('/')
    
    if (splitWorksheetLink.length >= 5) {
      const worksheetID = worksheetLink.slice(firstLetterOfLinkID, lastLetterOfLinkID)

      await apiDetector.get<getWorksheetRowsDataInterface>(`/zabbix/${worksheetID}`)
        .then(response => {
          result = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    }

    return result
  }
  
  async function getGroupID(url: string, token: string, groupName: string) {
    const groups = await getGroupHost(url, token)
    let haveGroup = false
    let existingGroup: Array<string> = []

    groups.forEach((group) => {
      if (group.name === groupName) {
        haveGroup = true
        existingGroup.push(String(group.groupid))
      }
    })

    if (!haveGroup) {
      return await createHostGroup(url, token, groupName)
    } else {
      return existingGroup
    }
  }

  async function haveHost(url: string, token: string, hostName: string) {
    let result = false
    
    await axios.post<{
      id: number,
      jsonrpc: string,
      result: Array<any>
    }>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "host.get",
      "params": {
        output: 'extend',
        filter: {
          host: [
            hostName
          ]
        }
      },
      "id": 1,
      "auth": token
    })
      .then(response => {
        if (response.data.result.length > 0) {
          result = true
        }
      })
      .catch(error => {
        console.log(error)
      })

    return result
  }

  async function getHost(url: string, token: string, hostName: string) {
    let hostID = ''
    let templates: Array<{
      name: string,
      templateid: string
    }> = []
    
    await axios.post<{
      id: number,
      jsonrpc: string,
      result: Array<{
        hostid: string,
        host: string,
        parentTemplates: Array<{
          name: string,
          templateid: string
        }>
      }>
    }>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "host.get",
      "params": {
        output: 'extend',
        "selectParentTemplates": [
          "templateid",
          "name"
        ],
        filter: {
          host: [
            hostName
          ]
        },
        selectMacros: true
      },
      "id": 1,
      "auth": token
    })
      .then(response => {
        console.log(response.data.result);
        // hostID = response.data.result
        if (response.data.result.length > 0) {
          hostID = response.data.result[0].hostid
          if (!!response.data.result[0].parentTemplates) {
            templates = response.data.result[0].parentTemplates
          }
        }
      })
      .catch(error => {
        console.log(error)
      })

    return {
      id: hostID,
      templates
    }
  }

  async function createHost(
    accessInformations: {
      url: string,
      token: string,
    },
    equipamentInformations: {
      group: string,
      name: string,
      community: string,
      ip: string,
      version: string,
      description: string
    },
    complementInformations: {
      proxySelected: Array<{
        host: string,
        proxyid: string
      }>,
      templatesIDS: Array<number>
    }
  ) {
    let errors: Array<string> = []

    const equipamentGroup = equipamentInformations.group
    const equipamentName = equipamentInformations.name
    const equipamentCommunity = equipamentInformations.community
    const equipamentIp = equipamentInformations.ip
    const equipamentVersion = equipamentInformations.version
    const equipamentDescription = equipamentInformations.description

    const url = accessInformations.url
    const token = accessInformations.token

    const proxySelected = complementInformations.proxySelected
    const templatesIDS = complementInformations.templatesIDS

    const groupID = await getGroupID(url, token, equipamentGroup)

    const host = equipamentName.trim()
    let proxy_hostid: string = ''
    if (proxySelected.length > 0) {
      proxy_hostid = proxySelected[0].proxyid
    }

     // modelo/marca
     const macros = [
      {
        macro: '{$SNMP_COMMUNITY}',
        value: equipamentCommunity.trim(),
        // "description": equipamentDescription.trim()
      }
    ]

    const groups = [
      {
        'groupid': groupID[0]
      }
    ]

    // versão é retirada da tabela tendo que se v1 === 1 e se v2 === 2
    let version = 1
        
    if (equipamentVersion.includes('2')) {
      version = 2
    }

    if (equipamentVersion.includes('1')) {
      version = 1
    }
    
    if (equipamentVersion.includes('3')) {
      version = 3
    }

     // ip vem da tabela
    const interfaces = [
      {
        'type': 2,
        'useip': 1,
        'main': 1,
        // get to row
        'ip': equipamentIp,
        'dns': '',
        'port': '161',
        'details': {
          // get to row
          'version': version,
          'bulk': 1,
          'community': '{$SNMP_COMMUNITY}'
        }
      },
      {
        'type': 1,
        'useip': 1,
        'main': 1,
        // get to row
        'ip': equipamentIp,
        'dns': '',
        'port': '10050',
        'details': {
          // get to row
          'version': version,
          'bulk': 1,
          'community': '{$SNMP_COMMUNITY}'

        }
      }
    ]

    const templates = templatesIDS.map((templateID) => {
      return {
        'templateid': String(templateID)
      }
    })

    // request body params
    let params: any = {}

    params = {
      'host': host,
      'macros': macros,
      'groups': groups,
      'interfaces': interfaces,
      'templates': templates,
      "description": equipamentDescription.trim(),
    }

    if (!!proxy_hostid) {
      params = {
        ...params,
        proxy_hostid: proxy_hostid,
      }
    }

    await axios.post<{
      error?: {
        data: string
      }
    }>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "host.create",
      "params": params,
      "id": 1,
      "auth": token
    })
      .then(response => {
        console.log('send informations response:: ', response.data)

        if (!!response.data.error && response.data.error.data.includes('another template')) {
          if (errors.length > 0 && errors[0] !== 'Erro ao associar templates, por favor, verifique os templates selecionados para não haver conflitos') {
            errors.push('Erro ao associar templates, por favor, verifique os templates selecionados para não haver conflitos')
          } else {
            errors.push('Erro ao associar templates, por favor, verifique os templates selecionados para não haver conflitos')
          }
        }
      })
      .catch(error => {
        console.log('send informations error:', error)
      })

    return errors
  }

  async function isRowUpdatable() {
    const isUpdatable = false
    let updateInformation: {
      lineOfWorksheet: number,

      isGroup: boolean,
      isName: boolean,
      isCommunity: boolean,
      isIP: boolean,
      isVersion: boolean,
      isDescription: boolean
    } = {
      lineOfWorksheet: 0,

      isGroup: false,
      isName: false,
      isCommunity: false,
      isIP: false,
      isVersion: false,
      isDescription: false
    }



    return {
      isUpdatable,
      updateInformation
    }
  }

  async function updateHost(
    accessInformations: {
      url: string,
      token: string,
    },
    equipamentInformations: {
      hostID: string,
      actualTemplates: Array<{
        name: string,
        templateid: string
      }>,

      group: string,
      name: string,
      community: string,
      ip: string,
      version: string,
      description: string
    },
    complementInformations: {
      proxySelected: Array<{
        host: string,
        proxyid: string
      }>,
      templatesIDS: Array<number>
    }
  ) {
    let errors: Array<string> = []

    const equipamentGroup = equipamentInformations.group
    const equipamentName = equipamentInformations.name
    const equipamentCommunity = equipamentInformations.community
    const equipamentIp = equipamentInformations.ip
    const equipamentVersion = equipamentInformations.version
    const equipamentDescription = equipamentInformations.description

    const url = accessInformations.url
    const token = accessInformations.token

    const proxySelected = complementInformations.proxySelected
    const templatesIDS = complementInformations.templatesIDS

    const groupID = await getGroupID(url, token, equipamentGroup)

    const host = equipamentName.trim()

    // modelo/marca
    const macros = [
      {
        macro: '{$SNMP_COMMUNITY}',
        value: equipamentCommunity.trim(),
        // "description": equipamentDescription.trim()
      }
    ]

    const groups = [
      {
        'groupid': groupID[0]
      }
    ]

    // versão é retirada da tabela tendo que se v1 === 1 e se v2 === 2
    let version = 1
        
    if (equipamentVersion.includes('2')) {
      version = 2
    }

    if (equipamentVersion.includes('1')) {
      version = 1
    }
    
    if (equipamentVersion.includes('3')) {
      version = 3
    }

    const interfaces = [
      {
        'type': 2,
        'useip': 1,
        'main': 1,
        // get to row
        'ip': equipamentIp,
        'dns': '',
        'port': '161',
        'details': {
          // get to row
          'version': version,
          'bulk': 1,
          'community': '{$SNMP_COMMUNITY}'
        }
      },
      {
        'type': 1,
        'useip': 1,
        'main': 1,
        // get to row
        'ip': equipamentIp,
        'dns': '',
        'port': '10050',
        'details': {
          // get to row
          'version': version,
          'bulk': 1,
          'community': '{$SNMP_COMMUNITY}'

        }
      }
    ]

    // templates
    let templates: Array<{
        templateid: string;
    }> = []
    templatesIDS.forEach((templateID) => {
      templates.push({
        'templateid': String(templateID)
      })
    })
    equipamentInformations.actualTemplates.forEach((template) => {
      templates.push({
        'templateid': String(template.templateid)
      })
    })

    // request body params
    const params = {
      'hostid': equipamentInformations.hostID,
      'macros': macros,
      'groups': groups,
      'templates': templates,
      "description": equipamentDescription.trim(),
    }

    await axios.post<{
      error?: {
        data: string
      }
    }>(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "host.update",
      "params": params,
      "id": 1,
      "auth": token
    })
      .then(response => {
        console.log('send informations response:: ', response.data)

        if (errors.length > 0 && errors[0] !== 'Erro ao associar templates, por favor, verifique os templates selecionados para não haver conflitos') {
          errors.push('Erro ao associar templates, por favor, verifique os templates selecionados para não haver conflitos')
        } else {
          errors.push('Erro ao associar templates, por favor, verifique os templates selecionados para não haver conflitos')
        }
      })
      .catch(error => {
        console.log('send informations error:', error)
      })
    
    await axios.post(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "host.update",
      "params": {
        ...params,
        'interfaces': interfaces
      },
      "id": 1,
      "auth": token
    })
      .then(response => {
        console.log('send informations response:: ', response.data)
      })
      .catch(error => {
        console.log('send informations error:', error)
      })

    return errors
  }

  async function sendInformationsToZabbix(
    url: string,
    token: string,
    worksheetData: Array<Array<string>>,
    templatesIDS: Array<number>,
    proxySelected:  Array<{
      host: string,
      proxyid: string
    }>
  ) {
    let updatesToMake: Array<{
      lineOfWorksheet: number,

      isGroup: boolean,
      isName: boolean,
      isCommunity: boolean,
      isIP: boolean,
      isVersion: boolean,
      isDescription: boolean
    }> = []
    let errorsResponse: Array<string> = []

    for (let index = 0; index < worksheetData.length; index++) {
      const row = worksheetData[index]

      const equipamentGroup = row[0]
      const equipamentName = row[1]
      const equipamentCommunity = row[2]
      const equipamentIp = row[3]
      const equipamentVersion = row[4]
      const equipamentDescription = row[5]
      
      // get host
      const isHaveHost = await haveHost(url, token, equipamentName)
      // if have host, indicate update
      if (isHaveHost) {
        const { 
          id: hostID,
          templates
        } = await getHost(url, token, equipamentName)
        
        const errors = await updateHost(
          { url, token },
          { 
            hostID: hostID,
            actualTemplates: templates,

            group: equipamentGroup,
            name: equipamentName,
            community: equipamentCommunity,
            ip: equipamentIp,
            version: equipamentVersion,
            description: equipamentDescription
          },
          {
            proxySelected,
            templatesIDS
          }
        )

        if (errors.length > 0 && errorsResponse.length > 0 && errors[0] !== errorsResponse[0]) {
          errorsResponse.push(errors[0])
        }

        if (errors.length > 0 && errorsResponse.length === 0) {
          errorsResponse.push(errors[0])
        }
      } else {
        // if not, create this
        const errors = await createHost(
          { url, token },
          { 
            group: equipamentGroup,
            name: equipamentName,
            community: equipamentCommunity,
            ip: equipamentIp,
            version: equipamentVersion,
            description: equipamentDescription
          },
          {
            proxySelected,
            templatesIDS
          }
        )

        if (errors.length > 0 && errorsResponse.length > 0 && errors[0] !== errorsResponse[0]) {
          errorsResponse.push(errors[0])
        }

        if (errors.length > 0 && errorsResponse.length === 0) {
          errorsResponse.push(errors[0])
        }
      }
    }

    return errorsResponse
  }

  return {
    // useAuth
    login,
    logout,
    getWorksheetRowsData,

    createHostGroup,
    getGroupHost,
    getProxy,
    getTemplates,

    validateWorksheet,

    sendInformationsToZabbix
  }
}
