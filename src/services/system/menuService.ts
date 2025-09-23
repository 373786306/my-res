import apiClient from '../../lib/axiosConfig'
import handleTree from '../commons'

export const menuInfo = async (params: any): Promise<any> => {
    const res = await apiClient.get('/system/menu/list', {params})
    return handleTree(res.data, 'menuId', 'parentId', 'children')
}

export const menuTree = async (): Promise<any> => {
    const res = await apiClient.get('/system/menu/list')
    const menuOptions = []
    const menu = { menuId: 0, menuName: '主类目', children: [] }
    menu.children = handleTree(res.data, "menuId", 'parentId', 'children')
    menuOptions.push(menu)
    return menuOptions
}

export const addMenu = async (params: any): Promise<any> => {
    const res = await apiClient.post('/system/menu', params)
    return res
}

export const editMenu = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/menu', params)
    return res
}


export const deleteMenu = async (menuId: number): Promise<any> => {
    const res = await apiClient.delete(`/system/menu/${menuId}`)
    return res
}


