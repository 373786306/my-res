import apiClient from '../../lib/axiosConfig'
import type {commonListResponse, post } from '../../type/system'


export const postInfo = async (params: any): Promise<any> => {
    return await apiClient.get<commonListResponse<post>, commonListResponse<post>>('/system/post/list', {params})
}


export const addPost = async (params: any): Promise<any> => {
    return await apiClient.post('/system/post', params)
}

export const editPost = async (params: any): Promise<any> => {
    const res = await apiClient.put('/system/post', params)
    return res
}

export const deletePost = async (postId: number): Promise<any> => {
    const res = await apiClient.delete(`/system/post/${postId}`)
    return res
}



