import apiClient from '../../lib/axiosConfig'


export const info = async (): Promise<any> => {
    const res = await apiClient.get('/product/conbine/list')
    return res
}

export const productList = async (params: any): Promise<any> => {
    const res = await apiClient.get('/product/conbine/productList', { params })
    return res
}

export const add = async (params: any): Promise<any> => {
    const res = await apiClient.post('/product/conbine', params)
    return res.data
}

export const del = async (id: string): Promise<boolean> => {
    const res = await apiClient.delete(`/product/conbine/${id}`)
    return res.data
}
