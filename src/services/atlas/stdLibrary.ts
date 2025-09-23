import apiClient from '../../lib/axiosConfig'


export const industryInfo = async (): Promise<any> => {
    const res = await apiClient.get('/standard/library/industryList')
    return res.data
}

export const stdInfo = async (params: any): Promise<any> => {
    const res = await apiClient.get('/standard/library/getIndustryStandard', {params})
    return res
}

export const stdFieldsInfo = async (industryId: string): Promise<any> => {
    const res = await apiClient.get(`/standard/library/getIndustryFormProperty/${industryId}`)
    return res.data
}

export const add = async (data: any): Promise<any> => {
    const res = await apiClient.post('/standard/library', {}, {params:data})
    return res.data
}

export const edit = async (data: any): Promise<any> => {
    const res = await apiClient.put('/standard/library', {}, {params:data})
    return res.data
}


export const del = async (standardId: string, industryId: string): Promise<boolean> => {
    const res = await apiClient.delete(`/standard/library/${standardId}/${industryId}`)
    return res.data
}

export const standardUrl = async (standardNo: string): Promise<any> => {
    const res = await apiClient.get(`/standard/library/getStandardPDF/${standardNo}`)
    return res.data
}

