import apiClient from '../../lib/axiosConfig'


export const info = async (): Promise<any> => {
    const res = await apiClient.get('/product/mapping/productList')
    return res
}

export const mappingInfo = async (params: any): Promise<any> => {
    const res = await apiClient.get('/product/mapping/stdList', {params})
    return res
}

export const industryInfo = async (): Promise<any> => {
    const res = await apiClient.get('/product/mapping/getindustry')
    return res.data
}

export const stdInfo = async (params: any): Promise<any> => {
    const res = await apiClient.get('/product/mapping/getlcatdata', {params})
    return res
}

export const addMapping = async (params: any): Promise<any> => {
    const res = await apiClient.post('/product/mapping', params)
    return res.data
}

export const delMapping = async (standardId: string, relevanceId: string): Promise<boolean> => {
    const res = await apiClient.delete(`/product/mapping/${standardId}/${relevanceId}`)
    return res.data
}
