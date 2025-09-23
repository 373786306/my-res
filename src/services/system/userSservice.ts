import apiClient from '../../lib/axiosConfig'
import type { TreeNode, commonListResponse, User } from '../../type/system'



export const deptTree = async (): Promise<TreeNode[]> => {
    const res = await apiClient.get('/system/user/deptTree')
    return res.data
}

export const userInfo = async (params: any): Promise<commonListResponse<User>> => {
    const res = await apiClient.get<commonListResponse<User>, commonListResponse<User>>('/system/user/list', {params})
    return res
}

export const changeUserStatus = async (userId: number, status: string): Promise<any> => {
    const res = await apiClient.put('/system/user/changeStatus', {userId, status})
    return res
}

export const addUser = async (params: any): Promise<any> => {
    const res = await apiClient.post('/system/user', params)
    return res
}
   
export const updateUser = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/user', params)
    return res
}

export const deleteUser = async (userId: number): Promise<any> => {
    const res = await apiClient.delete(`/system/user/${userId}`)
    return res
}

export const updatePassword = async (userId: number, password: string): Promise<any> => {
    const res = await apiClient.put('/system/user/resetPwd', {userId, password})
    return res
}

