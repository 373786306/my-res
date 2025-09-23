import apiClient from '../../lib/axiosConfig'
import type {TreeNode, commonListResponse, post } from '../../type/system'


export const roleInfo = async (params: any): Promise<any> => {
    return await apiClient.get<commonListResponse<post>, commonListResponse<post>>('/system/role/list', {params})
}

export const unallocatedList = async (params: any): Promise<any> => {
    return await apiClient.get<commonListResponse<post>, commonListResponse<post>>('/system/role/authUser/unallocatedList', {params})
}


export const menuTree = async (): Promise<TreeNode[]> => {
    const res = await apiClient.get('/system/menu/treeselect')
    return res.data
}

export const roleMenuTreeselect = async (roleId: number): Promise<any> => {
    const res = await apiClient.get(`/system/menu/roleMenuTreeselect/${roleId}`)
    return res.data
}

export const roleDeptTreeselect = async (roleId: number): Promise<any> => {
    const res = await apiClient.get(`/system/role/deptTree/${roleId}`)
    return res.data
}

export const dataScope = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/role/dataScope', params)
    return res
}

export const batchAddAuth = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/role/authUser/selectAll', params)
    return res
}

export const batchCancelAuth = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/role/authUser/cancelAll', params)
    return res
}

export const cancelAuthUser = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/role/authUser/cancel', params)
    return res
}


export const allocatedList = async (params: any): Promise<any> => {
    return await apiClient.get<commonListResponse<post>, commonListResponse<post>>('/system/role/authUser/allocatedList', {params})
}

export const addRole = async (params: any): Promise<any> => {
    const res = await apiClient.post('/system/role', params)
    return res
}

export const editRole = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/role', params)
    return res
}


export const deleteRole = async (roleId: number): Promise<any> => {
    const res = await apiClient.delete(`/system/role/${roleId}`)
    return res
}



