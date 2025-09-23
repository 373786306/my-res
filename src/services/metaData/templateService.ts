import apiClient from '../../lib/axiosConfig'
import type {commonListResponse, post } from '../../type/system'


export const info = async (params: any): Promise<any> => {
    return await apiClient.get<commonListResponse<post>, commonListResponse<post>>('/wrj/template/list', {params})
}


export const add = async (params: any): Promise<any> => {
    return await apiClient.post('/wrj/template', params)
}

export const edit = async (params: any): Promise<any> => {
    const res = await apiClient.put('/wrj/template', params)
    return res
}

export const del = async (templateId: number): Promise<any> => {
    const res = await apiClient.delete(`/wrj/template/${templateId}`)
    return res
}

export const allProperty = async (): Promise<any> => {
    return await apiClient.get('/wrj/property/list1')
}

export const templateProperty = async (templateId: string): Promise<any> => {
    return await apiClient.get(`/wrj/template/property/${templateId}`)
}

export const addTemplateProperty = async (params: any): Promise<any> => {
    return await apiClient.post('/wrj/template/property/save', params)
}




