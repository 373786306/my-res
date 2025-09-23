import apiClient from '../../lib/axiosConfig'

export const productInfo = async (): Promise<any> => {
    const res = await apiClient.get('/search/product')
    return res.data
}

export const categoryInfo = async (): Promise<any> => {
    const res = await apiClient.get('/search/category')
    return res.data
}

export const mapping = async (data: any): Promise<any> => {
    const res = await apiClient.post('/search/mapping', data)
    return res.data
}

export const search = async (params: any): Promise<any> => {
    const res = await apiClient.get(`/search`, {params})
    return res
}
