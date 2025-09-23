// utils/download.ts 或直接写在 apiClient 文件里

import apiClient from '../lib/axiosConfig'
import { ElMessage } from 'element-plus'

/**
 * 通用导出函数
 * @param url - 导出接口地址
 * @param data - 请求体数据（POST 用）
 * @param params - URL 参数（GET 用）
 * @param method - 请求方法，默认 post
 * @param filename - 指定文件名（可选，会尝试从响应头读取）
 */
export const download = async (
  url: string,
  {
    data = {},
    params = {},
    method = 'post',
    filename = ''
  }: {
    data?: Record<string, any>
    params?: Record<string, any>
    method?: 'get' | 'post'
    filename?: string
  } = {}
) => {
  try {
    const response = await apiClient({
      url,
      method,
      params: method === 'get' ? params : {},
      data: method === 'post' ? data : undefined,
      responseType: 'blob', // ✅ 必须是 blob
      // 避免被响应拦截器处理 JSON
      // 我们手动处理 blob
    })

    // 检查是否是错误响应（后端返回的错误，但状态码是 200）
    const blob = response.data
    const contentType = response.headers['content-type'] || ''

    // 如果返回的是 JSON 而不是文件流，说明是错误信息
    if (contentType.includes('application/json')) {
      // 读取 blob 内容判断错误
      const reader = new FileReader()
      reader.readAsText(blob, 'utf-8')
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string)
          const msg = json.msg || '导出失败'
          ElMessage.error(msg)
        } catch (e) {
          ElMessage.error('导出失败：未知错误')
        }
      }
      return
    }

    // 正常文件流处理
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl

    // 尝试从响应头获取文件名
    const contentDisposition = response.headers['content-disposition']
    let fileNameFromHeader = ''
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename[^;=\n]*=([^;\n]*)/i)
      if (matches != null && matches[1]) {
        fileNameFromHeader = decodeURIComponent(matches[1].replace(/['"]/g, ''))
      }
    }

    // 优先使用 header 的文件名，其次使用传入的 filename，最后 fallback
    link.download = fileNameFromHeader || filename || 'export.xlsx'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)

    ElMessage.success('导出成功')
  } catch (error: any) {
    console.error('【导出错误】', error)

    if (error.message === 'Network Error') {
      ElMessage.error('网络连接失败，请检查网络')
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试')
    } else if (error.response) {
      const { status, data } = error.response

      // 尝试读取 blob 错误信息
      if (data instanceof Blob && data.type.includes('application/json')) {
        const reader = new FileReader()
        reader.readAsText(data, 'utf-8')
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string)
            ElMessage.error(json.msg || '导出失败')
          } catch (e) {
            ElMessage.error('导出失败：服务器错误')
          }
        }
      } else if (status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        // 可触发登出逻辑
      } else {
        ElMessage.error('导出失败：' + (error.response.data?.msg || '未知错误'))
      }
    } else {
      ElMessage.error('导出失败：请检查参数或网络')
    }
  }
}