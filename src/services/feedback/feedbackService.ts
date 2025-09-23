import apiClient from '../../lib/axiosConfig'
import { download } from '../../utils/download'


export const info = async (params: any): Promise<any> => {
    const res = await apiClient.get('/feedback/getTotalDataList', {params})
    return res
}

export const edit = async (params: any): Promise<any> => {
    const res = await apiClient.put('/feedback', params)
    return res.data
}

export const del = async (id: string): Promise<boolean> => {
    const res = await apiClient.delete(`/feedback/${id}`)
    return res.data
}

export const feedbackExport = async (params: any): Promise<any> => {
    await download('/feedback/export', {
    data: {
        ...params
    },
    filename: '反馈数据.xlsx'
    })
}





