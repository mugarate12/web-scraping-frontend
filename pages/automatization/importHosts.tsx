import {
  useState,
  useEffect
} from 'react'

import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  IconButton,
  TextField,
  Typography,
  Autocomplete
} from '@mui/material'

import { 
  DataGrid
} from '@mui/x-data-grid'

import {
  AccountCircle,
  Close,
  Lock,
  FileCopy,
  Visibility,
  VisibilityOff
} from '@material-ui/icons'

import {
  ActionConfirmation
} from './../../components'

import {
  CreateHostPerfil,
  EditHostPerfilModal
} from './../../containers'

import {
  useAlert,
  useZabbix,
  useHostsPerfis,
  useHostsPerfisOperations
} from './../../hooks'

import styles from '../../styles/importHosts.module.css'

const ImportHosts: NextPage = () => {
  const alertHook = useAlert()
  const zabbix = useZabbix()

  const [ updateHostPerfis, setUpdateHostsPerfis ] = useState<boolean>(false)
  const hostsPerfis = useHostsPerfis({ 
    update: updateHostPerfis,
    setUpdate: setUpdateHostsPerfis 
  })
  const hostsPerfisOperations = useHostsPerfisOperations()

  const [ url, setURL ] = useState<string>('')
  const [ user, setUser ] = useState<string>('')

  const [ password, setPassword ] = useState<string>('')
  const [ showPassword, setShowPassword ] = useState<boolean>(false)

  const [ link, setLink ] = useState<string>('')

  const [ authToken, setAuthToken ] = useState<string>('')
  const [ loginControl, setLoginControl ] = useState<boolean>(true)
  const [ actionType, setActionType ] = useState<'login' | 'get-informations' | 'send-informations'>('login')
  
  // handle templates
  const [ openTemplateModal, setOpenTemplateModal ] = useState<boolean>(false)
  const [ templatesSelected, setTemplatesSelected ] = useState<Array<string>>([])
  const [ templates, setTemplates ] = useState<Array<{
    templateid: number,
    host: string
  }>>([])
  const [ templateSearch, setTemplateSearch ] = useState<string>('')

  // handle proxy
  const [ openProxyModal, setOpenProxyModal ] = useState<boolean>(false)
  const [ proxySelected, setProxySelected ] = useState<Array<string>>([])
  const [ proxies, setProxies ] = useState<Array<{
    proxyid: number,
    host: string
  }>>([])
  const [ proxySearch, setProxySearch ] = useState<string>('')

  // handle worksheet
  const [ openWorksheetModal, setOpenWorksheetModal ] = useState<boolean>(false)
  const [ worksheet, setWorksheet ] = useState<string[][]>([])

  // handle create host perfil modal
  const [ showCreateHostPerfil, setShowCreateHostPerfil ] = useState<boolean>(false)

  // view perfis handle
  const [ confirmationDeleteModal, setConfirmationDeleteModal ] = useState<boolean>(false)
  const [ confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [ perfilIDToDelete, setPerfilIDToDelete ] = useState<number>()

  const [ showEditModal, setShowEditModal ] = useState<boolean>(false)
  const [ userToEdit, setUserToEdit ] = useState<{
    id: number,
    name: string,
    user: string,
    password: string,
    url: string,
    link: string,
  }>()

  async function login() {
    if (!!url && !!user && !!password) {
      const token = await zabbix.login(url, user, password)
      
      if (token.length > 0) {
        alertHook.showAlert('usuário logado com sucesso!', 'success')

        setAuthToken(token)

        const templatesContent = await zabbix.getTemplates(url, token)
        const proxiesContent = await zabbix.getProxy(url, token)

        setTemplates(templatesContent)
        setProxies(proxiesContent)

        setActionType('get-informations')
        // setOpenTemplateModal(fal)
      }

    } else {
      alertHook.showAlert('preencha todas as informações necessárias', 'error')
    }
  }

  async function getInformations() {
    if (!!link) {
      alertHook.showAlert('Coletando dados da planilha', 'warning')
      const worksheetData = await zabbix.getWorksheetRowsData(link)
      alertHook.showAlert('Dados coletados!', 'success')

      const validateWorksheet = zabbix.validateWorksheet(worksheetData)

      setWorksheet(worksheetData)

      if (worksheetData.length > 0 && validateWorksheet) {
        setActionType('send-informations')
      }
    } else {
      alertHook.showAlert('adicione o link da planilha', 'error')
    }
  }

  async function sendInformations() {
    if (templatesSelected.length > 0) {
      let templatesIDs: Array<number> = []
      let proxiesSelecteds: Array<{
        host: string,
        proxyid: string
      }> = []

      templates.forEach((template) => {
        templatesSelected.forEach(templateSelected => {
          if (template.host === templateSelected) {
            console.log(template)
            
            templatesIDs.push(template.templateid)
          }
        })
      })

      proxies.forEach(proxy => {
        proxySelected.forEach(selected => {
          if (selected === proxy.host) {
            // proxiesIDs.push(proxy.proxyid)
            proxiesSelecteds.push({
              host: proxy.host,
              proxyid: String(proxy.proxyid)
            })
          }
        })
      })

      // send informations
      alertHook.showAlert('Atualizando dados e enviando ', 'warning')

      const worksheetData = await zabbix.getWorksheetRowsData(link)
      setWorksheet(worksheetData)

      await zabbix.sendInformationsToZabbix(url, authToken, worksheet, templatesIDs, proxiesSelecteds)

      alertHook.showAlert('Informações adicionadas!', 'success')
    } else {
      alertHook.showAlert('selecione ao menos um template', 'error')
    }
  }

  function buttonText() {
    if (actionType === 'login') {
      return 'logar'
    } else if (actionType === 'get-informations') {
      return 'coletar informações'
    } else {
      return 'enviar dados'
    }
  }

  async function buttonAction() {
    if (actionType === 'login') {
      await login()
    } else if (actionType === 'get-informations') {
      await getInformations()
    } else {
      await sendInformations()
    }
  }

  function formatOptions() {
    const formatted = hostsPerfis.map((perfil) => {
      const firstLetter = perfil.name[0].toUpperCase()
      const option = perfil.name

      return {
        firstLetter, 
        option,
        ...perfil
      }
    })

    return formatted
  }

  function renderLogin() {
    if (actionType === 'login') {
      return (
        <>
          <Autocomplete
            // value={autoCompleteValue}
            onChange={(event, newValue) => {
              if (!!newValue) {
                setUser(newValue.user)
                setPassword(newValue.password)
                setURL(newValue.url)
                setLink(newValue.worksheet_link)
              }
            }}
            options={formatOptions().sort((a, b) => b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.option}
            sx={{
              width: 200
            }}
            renderInput={(params) => <TextField {...params} label="Perfis" />}
          />

          <TextField
            label="url"
            value={url}
            onChange={(event) => setURL(event.target.value)}
          />
  
          <TextField
            label="user"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: '#000' }} />
                </InputAdornment>
              ),
            }}
            value={user}
            onChange={(event) => setUser(event.target.value)}
          />
  
          <TextField
            label="senha"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#000' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(event) => {
                      event.preventDefault()
                    }}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </>
      )
    } 
  }

  function renderViewWorksheet() {
    if (worksheet.length > 0) {
      return (
        <Button
          variant='outlined'
          size='small'
          color='info'
          onClick={() => {
            setOpenWorksheetModal(true)
          }}
        >Ver planilha</Button>
      )
    }
  }

  function renderGetInformations() {
    if (actionType !== 'login') {
      return (
        <>
          <Button
            variant='outlined'
            size='small'
            color='info'
            onClick={() => {
              setOpenTemplateModal(true)
            }}
          >Selecionar templates</Button>
          
          <Button
            variant='outlined'
            size='small'
            color='info'
            onClick={() => {
              setOpenProxyModal(true)
            }}
          >Selecionar proxies</Button>

          <TextField
            label="link da planilha"
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />

          {renderViewWorksheet()}
        </>
      )
    }
  }

  function selectChecked(templateName: string) {
    let copyArray = templatesSelected

    if (templatesSelected.includes(templateName)) {
      copyArray = copyArray.filter(name => name !== templateName)
    } else {
      copyArray.push(templateName)
    }

    setTemplatesSelected(copyArray)
  }

  function renderTemplateOption(templateName: string, key: string) {
    const checked = templatesSelected.includes(templateName)

    return (
      <Box
        key={key}
        component='div'
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Checkbox
          // checked={clientChecked(client.id)}
          defaultChecked={checked}
          onChange={(event) => selectChecked(templateName)}
          inputProps={{ 'aria-label': 'controlled' }}
        />

        <Typography
          variant='subtitle2'
          component='p'
        >
          {templateName}
        </Typography>
      </Box>
    )
  }

  function renderTemplatesOptions() {
    if (templateSearch.length > 0) {
      const templatesFiltered = templates.filter((template) => {
        const haveSearch = template.host.includes(templateSearch)
        const haveSearchLowerCase = template.host.includes(templateSearch.toLowerCase())
        const haveSearchUpperCase = template.host.includes(templateSearch.toUpperCase())
        const haveSearchCapitalize = template.host.includes(`${templateSearch.slice(0, 1).toUpperCase()}${templateSearch.slice(1, templateSearch.length)}`)

        return haveSearch || haveSearchLowerCase || haveSearchUpperCase || haveSearchCapitalize
      })

      return templatesFiltered.map(template => {
        return renderTemplateOption(template.host, String(template.templateid))
      })
    } else {
      return templates.map((template) => {
        return renderTemplateOption(template.host, String(template.templateid))
      })
    }

  }

  function renderTemplatesModal() {
    if (openTemplateModal) {
      return (
        <div className={styles.modal_container}>
          <Box
            component="div"
            sx={{
              minHeight: '100px',
              maxHeight: '400px',
              
              minWidth: '100px',
              width: 'fit-content',
              maxWidth: '90%',

              padding: '5px 20px',
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',

              backgroundColor: '#FFF',

              borderRadius: '4px'
            }}
          >
            <Box
              component="div"
              sx={{
                width: '100%',

                padding: '5px 0px',
                
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="h6" component="p">
                Templates
              </Typography>

              <IconButton 
                aria-label='fechar'
                onClick={() => setOpenTemplateModal(false)}
              >
                <Close />
              </IconButton>
            </Box>

            <TextField
              label="procurar template"
              value={templateSearch}
              onChange={(event) => setTemplateSearch(event.target.value)}
            />

            <Box
              component="div"
              sx={{
                width: '100%',
                maxHeight: '205px',

                margin: '10px 0px',
                padding: '5px 0px',
                
                display: 'flex',
                flexDirection: 'column',
                // flexWrap: 'wrap',

                overflowY: 'scroll'
              }}
            >
              {renderTemplatesOptions()}
            </Box>

            <Button
              variant="contained" 
              size='small'
              color='success'
              sx={{
                width: '200px',

                alignSelf: 'flex-end'
              }}
              onClick={() => setOpenTemplateModal(false)}
            >
              Confirmar
            </Button>
          </Box>

      </div>
      )
    }
  }

  function selectProxy(proxyName: string) {
    setProxySelected([ proxyName ])
    renderProxyOptions()
  }

  function renderProxyOption(proxyName: string, key: string) {
    const checked = proxySelected.includes(proxyName)

    return (
      <Box
        key={key}
        component='div'
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Checkbox
          // checked={clientChecked(client.id)}
          checked={checked}
          // defaultChecked={checked}
          onChange={(event) => selectProxy(proxyName)}
          inputProps={{ 'aria-label': 'controlled' }}
        />

        <Typography
          variant='subtitle2'
          component='p'
        >
          {proxyName}
        </Typography>
      </Box>
    )
  }

  function renderProxyOptions() {
    if (proxySearch.length > 0) {
      const proxiesFiltered = proxies.filter(proxy => {
        const haveSearch = proxy.host.includes(proxySearch)
        const haveSearchLowerCase = proxy.host.includes(proxySearch.toLowerCase())
        const haveSearchUpperCase = proxy.host.includes(proxySearch.toUpperCase())
        const haveSearchCapitalize = proxy.host.includes(`${proxySearch.slice(0, 1).toUpperCase()}${proxySearch.slice(1, proxySearch.length)}`)
      
        return haveSearch || haveSearchLowerCase || haveSearchUpperCase || haveSearchCapitalize
      })

      return proxiesFiltered.map(proxy => {
        return renderProxyOption(proxy.host, String(proxy.proxyid))
      })
    } else {
      return proxies.map((proxy) => {
        return renderProxyOption(proxy.host, String(proxy.proxyid))
      })
    }
  }
  
  function renderProxyModal() {
    if (openProxyModal) {
      return (
        <div className={styles.modal_container}>
          <Box
            component="div"
            sx={{
              minHeight: '100px',
              maxHeight: '400px',
              
              minWidth: '100px',
              width: 'fit-content',
              maxWidth: '90%',

              padding: '5px 20px',
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',

              backgroundColor: '#FFF',

              borderRadius: '4px'
            }}
          >
            <Box
              component="div"
              sx={{
                width: '100%',

                padding: '5px 0px',
                
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="h6" component="p">
                Proxies
              </Typography>

              <IconButton 
                aria-label='fechar'
                onClick={() => setOpenProxyModal(false)}
              >
                <Close />
              </IconButton>
            </Box>

            <TextField
              label="procurar proxy"
              value={proxySearch}
              onChange={(event) => setProxySearch(event.target.value)}
            />

            <Box
              component="div"
              sx={{
                width: '100%',
                maxHeight: '205px',

                margin: '10px 0px',
                
                display: 'flex',
                flexDirection: 'column',
                // flexWrap: 'wrap',
                overflowY: 'scroll'
              }}
            >
              {renderProxyOptions()}
            </Box>

            <Button
              variant="contained" 
              size='small'
              color='success'
              sx={{
                width: '200px',

                alignSelf: 'flex-end'
              }}
              onClick={() => setOpenProxyModal(false)}
            >
              Confirmar
            </Button>
          </Box>
      </div>
      )
    }
  }
  
  function renderWorksheetModal() {
    if (openWorksheetModal) {
      const columns = [
        { field: 'col1', headerName: 'Grupo do equipamento', width: 200 },
        { field: 'col2', headerName: 'Nome do equipamento', width: 200 },
        { field: 'col3', headerName: 'Comunidade Snmp', width: 150 },
        { field: 'col4', headerName: 'Ip', width: 100 },
        { field: 'col5', headerName: 'Versão Snmp', width: 100 },
        { field: 'col6', headerName: 'Modelo/Marca', width: 100 }
      ]

      const rows = worksheet.map((row, index) => {
        return {
          id: index,
          col1: row[0],
          col2: row[1],
          col3: row[2],
          col4: row[3],
          col5: row[4],
          col6: row[5]
        }
      })

      return (
        <div className={styles.modal_container}>
          <Box
            component="div"
            sx={{
              minHeight: '100px',
              maxHeight: '98vh',
              
              minWidth: '100px',
              width: 'fit-content',
              maxWidth: '90%',

              padding: '5px 20px',
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',

              backgroundColor: '#FFF',

              borderRadius: '4px',

              overflowY: 'scroll'
            }}
          >
            <Box
              component="div"
              sx={{
                width: '100%',

                padding: '5px 0px',
                
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="h6" component="p">
                Planilha
              </Typography>

              <IconButton 
                aria-label='fechar'
                onClick={() => setOpenWorksheetModal(false)}
              >
                <Close />
              </IconButton>
            </Box>

            <div
              style={{
                // minHeight: '300px',
                minHeight: '500px',
                height: '100%', 
                maxHeight: '98%',

                width: '865px'
              }}
            >
              <DataGrid 
                rows={rows} 
                columns={columns}
                isRowSelectable={() => false}
                isCellEditable={() => false}
              />
            </div>
          </Box>
        </div>
      )
    }
  }

  async function updateTemplates() {
    const templatesContent = await zabbix.getTemplates(url, authToken)

    setTemplates(templatesContent)
  }

  async function updateProxy() {
    const proxiesContent = await zabbix.getProxy(url, authToken)
    setProxies(proxiesContent)
  }

  function renderCreateHostPerfilModal() {
    if (showCreateHostPerfil) {
      return (
        <CreateHostPerfil
          title='Criar Perfil'
        
          setViewModal={setShowCreateHostPerfil}
          setUpdatePerfis={setUpdateHostsPerfis}
        />
      )
    }
  }

  // view hosts 
  async function clipToClipboard(content: string) {
    if (typeof (navigator.clipboard) == 'undefined') {
      let textArea = document.createElement('textarea')
      
      textArea.value = content
      textArea.style.position = "fixed"
      document.body.appendChild(textArea)
  
      textArea.focus()
      textArea.select()
  
      document.execCommand('copy')
  
      document.body.removeChild(textArea)
      
      alertHook.showAlert('copiada!', 'success')
    } else {
      await navigator.clipboard.writeText(content)
      alertHook.showAlert('copiada!', 'success')
    }
  }

  async function removeClient() {
    if (!!confirmDelete && !!perfilIDToDelete) {
      const result = await hostsPerfisOperations.remove({ id: perfilIDToDelete })
  
      if (result) {
        setUpdateHostsPerfis(true)
  
        setConfirmDelete(false)
        setConfirmationDeleteModal(false)
        setPerfilIDToDelete(undefined)
      }
    }
  }
  
  function normalizeData() {
    return hostsPerfis.map((perfil) => {
      return {
        id: perfil.id,
        col1: perfil.name,
        col2: perfil.user,
        col3: perfil.password,
        col4: perfil.url,
        col5: perfil.worksheet_link
      }
    })
  }

  const rows = normalizeData()

  const columns = [
    { field: 'col1', headerName: 'Nome', width: 250 },
    { field: 'col2', headerName: 'Usuário', width: 150 },
    { field: 'col3', headerName: 'Senha', width: 150 },
    { 
      field: 'col4', 
      headerName: 'Url', 
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']
        const key: string = row['col4']

        return (
          <div className={styles.key_container}>
            <p className={styles.key_text}>{key}</p>

            <IconButton 
              aria-label="copy content"
              sx={{
                zIndex: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
              className={styles.key_button}
              onClick={() => clipToClipboard(key)}
            >
              <FileCopy />
            </IconButton>
          </div>
        )
      }
    },
    { 
      field: 'col5', 
      headerName: 'Link', 
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']
        const key: string = row['col5']

        return (
          <div className={styles.key_container}>
            <p className={styles.key_text}>{key}</p>

            <IconButton 
              aria-label="copy content"
              sx={{
                zIndex: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
              className={styles.key_button}
              onClick={() => clipToClipboard(key)}
            >
              <FileCopy />
            </IconButton>
          </div>
        )
      }
    },
    { 
      field: 'col6', 
      headerName: 'Ações', 
      width: 170,
      disableClickEventBubbling: true,
      renderCell: (cellValues: any) => {
        const row = cellValues['row']

        const id: number = row['id']
        const name: string = row['col1']
        const user: string = row['col2']
        const password: string = row['col3']
        const url: string = row['col4']
        const link: string = row['col5']

        return (
          <div className={styles.key_container}>
            <Button 
              variant="contained" 
              color='warning'
              onClick={() => {
                setUserToEdit({
                  id,
                  name,
                  user,
                  password,
                  url, 
                  link
                })

                setShowEditModal(true)
              }}
            >
              Editar
            </Button>
            
            <Button 
              variant="contained" 
              color='error'
              onClick={() => {
                setConfirmationDeleteModal(true)
                setPerfilIDToDelete(id)
              }}
            >
              deletar
            </Button>
          </div>
        )
      }
    }
  ]

  function renderShowConfirmUpdatePermission() {
		if (confirmationDeleteModal) {
			return (
				<ActionConfirmation
					title='Deseja excluir este Perfil?'
					setConfirmationAction={setConfirmDelete}
					setShowModal={setConfirmationDeleteModal}
				/>
			)
		}
	}

  function renderEditModal() {
    if (showEditModal && !!userToEdit) {
      return (
        <EditHostPerfilModal
          title='Editar perfil'
          setViewModal={setShowEditModal}
          setUpdatePerfis={setUpdateHostsPerfis}
        
          id={userToEdit.id}
          name={userToEdit.name}
          user={userToEdit.user}
          password={userToEdit.password}
          url={userToEdit.url}
          link={userToEdit.link}
        />
      )
    }
  }

  useEffect(() => {
    removeClient()
  }, [ confirmDelete ])

  // view templates e proxies modals
  useEffect(() => {
    if (openTemplateModal) {
      updateTemplates()
    }
  }, [ openTemplateModal ])
  
  useEffect(() => {
    if (openProxyModal) {
      updateProxy()
    }
  }, [ openProxyModal ])

  return (
    <>
      <Head>
        <title>Importart hosts</title>
      </Head>

      {renderTemplatesModal()}
      {renderProxyModal()}
      {renderWorksheetModal()}

      {renderCreateHostPerfilModal()}

      {renderShowConfirmUpdatePermission()}
      {renderEditModal()}

      <Button 
        variant="contained" 
        size='small'
        color='success'
        sx={{
          position: 'absolute',

          top: '70px',
          right: '10px'
        }}
        onClick={() => {
          setShowCreateHostPerfil(true)
        }}
      >
        Criar Perfil
      </Button>

      <main className={styles.container}>
        <Image
          src='/assets/images/flowboxLogo.jpg'
          width={100}
          height={100}
        />

        <Box
          component="form"
          sx={{
            padding: '5px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          {renderLogin()}
        </Box>

        <Box
          component="form"
          sx={{
            padding: '5px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          {renderGetInformations()}

          <Button 
            variant="contained" 
            size='small'
            color='primary'
            style={{
              minHeight: '10px',
              // height: 'fit-content',
              minWidth: '10px',
              width: '80%',

              padding: '5px 5px',

              // backgroundColor: '#FFF',
              // color: '#333',

              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px'
            }}
            onClick={() => buttonAction()}
          >{buttonText()}</Button>

        </Box>
      </main>

      <div style={{ 
        height: '400px', 
        width: '100%',
        padding: '20px 30px'
      }}>
        <DataGrid 
          rows={rows} 
          columns={columns}
          isRowSelectable={() => false}
          isCellEditable={() => false}
        />
      </div>
    </>
  )
}

export default ImportHosts