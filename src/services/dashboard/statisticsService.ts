import apiClient from '../../lib/axiosConfig'



export const industryStatistics = async (): Promise<any> => {
    const res = await apiClient.get('/statistics/industry')
    return res.data
}

export const categoryStatistics = async (): Promise<any> => {
    const res = await apiClient.get('/statistics/category')
    return res.data
}

export const standardStatusStatistics = async (): Promise<any> => {
    const res = await apiClient.get('/statistics/standardStatus')
    return res.data
}

export const productStatistics = async (): Promise<any> => {
    const res = await apiClient.get('/statistics/productStatistics')
    return res.data
}



