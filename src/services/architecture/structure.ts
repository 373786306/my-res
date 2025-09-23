import apiClient from '../../lib/axiosConfig'

export const info = async (): Promise<any> => {
    const res = await apiClient.get('/structure/list')
    return res
}

export const tree = async (id: string): Promise<any> => {
    const res = await apiClient.get(`/structure/tree/${id}`)
    return res
}


