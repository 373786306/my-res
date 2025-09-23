import apiClient from '../../lib/axiosConfig'
import handleTree from '../commons'


export const deptInfo = async (params: any): Promise<any> => {
    const res = await apiClient.get('/system/dept/list', {params})
    return handleTree(res.data, 'deptId', 'parentId', 'children')
}

export const deptTree = async (): Promise<any> => {
    const res = await apiClient.get('/system/dept/list')
    return handleTree(res.data, "deptId", 'parentId', 'children')
}

export const addDept = async (params: any): Promise<any> => {
    const res = await apiClient.post('/system/dept', params)
    return res
}

export const editDept = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/dept', params)
    return res
}


export const deleteDept = async (deptId: number): Promise<any> => {
    const res = await apiClient.delete(`/system/dept/${deptId}`)
    return res
}



