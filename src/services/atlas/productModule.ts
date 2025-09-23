import apiClient from '../../lib/axiosConfig'


export const productLevelInfo = async (): Promise<any> => {
    const res = await apiClient.get('/product/module/list')
    return res
}

export const moduleInfo = async (params: any): Promise<any> => {
    const res = await apiClient.get('/system/product/moduleList', { params })
    return res
}

export const add = async (params: any): Promise<any> => {
    const res = await apiClient.post('/product/module', params)
    return res.data
}

export const edit = async (params: any): Promise<any> => {
    const res = await apiClient.put('/product/module', params)
    return res.data
}

export const del = async (id: string): Promise<boolean> => {
    const res = await apiClient.delete(`/product/module/${id}`)
    return res.data
}

export const addModule = async (params: any): Promise<any> => {
    const res = await apiClient.post('/system/product', params)
    return res.data
}

export const editModule = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/product/updatealone', params)
    return res.data
}

export const delModule = async (productIds: string): Promise<boolean> => {
    const res = await apiClient.delete(`/system/product/${productIds}`)
    return res.data
}