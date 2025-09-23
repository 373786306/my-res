import apiClient from '../../lib/axiosConfig'
import type {commonListResponse, post } from '../../type/system'


export const info = async (params: any): Promise<any> => {
    return await apiClient.get<commonListResponse<post>, commonListResponse<post>>('/wrj/property/list', {params})
}


export const add = async (params: any): Promise<any> => {
    return await apiClient.post('/wrj/property', params)
}

export const edit = async (params: any): Promise<any> => {
    const res = await apiClient.put('/wrj/property', params)
    return res
}

export const del = async (propertyId: number): Promise<any> => {
    const res = await apiClient.delete(`/wrj/property/${propertyId}`)
    return res
}
