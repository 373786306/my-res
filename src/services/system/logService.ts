import apiClient from '../../lib/axiosConfig'

export const loginInfo = async (params: any): Promise<any> => {
    return await apiClient.get('/monitor/logininfor/list', {params})
}

export const deleteInfo = async (ids:number[]): Promise<any> => {
    return await apiClient.delete(`/monitor/logininfor/${ids.join(',')}`)
}

export const deleteClear = async (): Promise<any> => {
    return await apiClient.delete('/monitor/logininfor/clean')
}

export const unlockUser = async (user: string): Promise<any> => {
    return await apiClient.get(`/monitor/logininfor/unlock/${user}`)
}


export const exportExcel = async (): Promise<any> => {
    return await apiClient.get('/monitor/logininfor/export')
}

// operation log service

export const operInfo = async (params: any): Promise<any> => {
    return await apiClient.get('/monitor/operlog/list', {params})
}


export const deleteOperInfo = async (ids:number[]): Promise<any> => {
    return await apiClient.delete(`/monitor/operlog/${ids.join(',')}`)
}

export const deleteOperClear = async (): Promise<any> => {
    return await apiClient.delete('/monitor/operlog/clean')
}