import apiClient from '../../lib/axiosConfig'


export const info = async (): Promise<any> => {
    const res = await apiClient.get('/category/mapping/categoryList')
    return res
}

export const mappingInfo = async (params: any): Promise<any> => {
    const res = await apiClient.get('/category/mapping/stdList', {params})
    return res.data
}

export const industryInfo = async (): Promise<any> => {
    const res = await apiClient.get('/product/mapping/getindustry')
    return res.data
}

export const addMapping = async (params: any): Promise<any> => {
    const res = await apiClient.post('/category/mapping', params)
    return res.data
}

export const delMapping = async (standardId: string, categoryId: string): Promise<boolean> => {
    const res = await apiClient.delete(`/category/mapping/${standardId}/${categoryId}`)
    return res.data
}

export const stdInfo = async (params: any): Promise<any> => {
    const res = await apiClient.get('/product/mapping/getlcatdata', {params})
    return res
}




