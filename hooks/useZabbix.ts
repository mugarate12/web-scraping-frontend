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

  async function getHost(url: string, token: string) {
    await axios.post(makeUrl(url), {
      "jsonrpc": "2.0",
      "method": "host.get",
      "params": {
        output: 'extend'
      },
      "id": 1,
      "auth": token
    })
      .then(response => {
        console.log(response.data)
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
        console.log('proxy: ', response.data)
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
        console.log('templates: ', response.data.result)
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

    const splitWorksheetLink = worksheetLink.split('/')
    
    if (splitWorksheetLink.length >= 5) {
      const worksheetID = splitWorksheetLink[5]

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
    // getHost(url, token)

    for (let index = 0; index < worksheetData.length; index++) {
      const row = worksheetData[index]

      const equipamentGroup = row[0]
      const equipamentName = row[1]
      const equipamentCommunity = row[2]
      const equipamentIp = row[3]
      const equipamentVersion = row[4]
      const equipamentDescription = row[5]

      console.log(`
        name: ${equipamentName}
        grupo: ${equipamentGroup}
        comunidade: ${equipamentCommunity}
        ip: ${equipamentIp}
        versão: ${equipamentVersion}
        descrição: ${equipamentDescription}
      `)
      
      if (row.length > 0) {
        const groupID = await getGroupID(url, token, row[0])

        //  proxy name
        const host = equipamentName.trim()
        // proy id
        const proxy_hostid = proxySelected[0].proxyid

        // modelo/marca
        const macros = [
          {
            macro: '{$SNMP_COMMUNITY}',
            // get to row
            value: equipamentCommunity.trim(),
            "description": equipamentDescription.trim()
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

        console.log('macros:', macros)
        console.log('groups: ', groups)
        console.log('templates: ', templates)
        console.log('interfaces: ', interfaces)

        // params
        const params = {
          'host': host,
          'proxy_hostid': proxy_hostid,
          'macros': macros,
          'groups': groups,
          'interfaces': interfaces,
          'templates': templates
        }

        console.log('parametros: ', params)

        await axios.post(makeUrl(url), {
          "jsonrpc": "2.0",
          "method": "host.create",
          "params": params,
          "id": 1,
          "auth": token
        })
          .then(response => {
            console.log('send informations response:: ', response.data)
          })
          .catch(error => {
            console.log('send informations error:', error)
          })
      }
    }
  }

  // create host create

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
