import apiClient from '../../lib/axiosConfig'
import type {commonListResponse, post } from '../../type/system'


export const info = async (params: any): Promise<any> => {
    return await apiClient.get<commonListResponse<post>, commonListResponse<post>>('/wrj/industry/list', {params})
}


export const add = async (params: any): Promise<any> => {
    return await apiClient.post('/wrj/industry', params)
}

export const edit = async (params: any): Promise<any> => {
    const res = await apiClient.put('/wrj/industry', params)
    return res
}

export const del = async (postId: number): Promise<any> => {
    const res = await apiClient.delete(`/wrj/industry/${postId}`)
    return res
}

export const createTable = async (industryId: string): Promise<any> => {
    return await apiClient.put(`/wrj/industry/createTable/${industryId}`)
}


export const propertyData = async (industryId: string): Promise<any> => {
    return await apiClient.get(`/wrj/industry/property/${industryId}`)
}

export const propertyInfo = async (industryId: string): Promise<any> => {
    return await apiClient.get(`wrj/industry/property/not/${industryId}`)
}

export const templateInfo = async (): Promise<any> => {
    return await apiClient.get('/wrj/template/all')
}

export const batchAddProperty = async (inducyId: string, ids: string[]): Promise<any> => {
    return await apiClient.get(`/wrj/industry/property/save/${inducyId}/${ids.join(',')}`)
}

export const deleteProperty = async (industryId: string, id: string): Promise<any> => {
    return await apiClient.delete(`/wrj/industry/property/delete/${industryId}/${id}`)
}

export const addTemplate = async (industryId: string, templateId: string): Promise<any> => {
    return await apiClient.get(`/wrj/industry/property/saveByTemplateId/${industryId}/${templateId}`)
}



