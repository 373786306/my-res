import apiClient from '../../lib/axiosConfig'
import type { TreeNode } from '../../type/system'



export const categoryTreeInfo = async (): Promise<TreeNode[]> => {
    const res = await apiClient.get('/wrj/category/list')
    return res.data
}

export const add = async (params: any): Promise<any> => {
    const res = await apiClient.post('/wrj/category', params)
    return res.data
}

export const edit = async (params: any): Promise<any> => {
    const res = await apiClient.put('/wrj/category', params)
    return res.data
}

export const del = async (id: string): Promise<boolean> => {
    const res = await apiClient.delete(`/wrj/category/${id}`)
    return res.data
}