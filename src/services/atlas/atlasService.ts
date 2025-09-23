import apiClient from '../../lib/axiosConfig'



export const productInfo = async (): Promise<any> => {
    const res = await apiClient.get('/structure/productList')
    return res
}

export const getCategoryInfo = async (): Promise<any> => {
    const res = await apiClient.get('/structure/categoryList')
    return res
}

export const getStandardInfo = async (relevanceId: string, categoryId: string): Promise<any> => {
    const res = await apiClient.get(`/structure/standardList/${relevanceId}/${categoryId}`)
    return res.data
}

export const getGraphData = async (relevanceId: string, categoryId: string): Promise<any> => {
    const res = await apiClient.get('/structure/productGraph', {params: {relevanceId: relevanceId, categoryId: categoryId}})
    return res.data
}

export const add = async (params: any): Promise<any> => {
    const res = await apiClient.post('/feedback', params)
    return res.data
}


