import {useAuthStore} from '../stores/useAuthStore'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import axios from 'axios'
import type { AxiosInstance} from 'axios'

const apiClient : AxiosInstance = axios.create({
  baseURL:  '/api', // 使用环境变量
  
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  },
  timeout: 5000,
});

// 请求拦截器：添加 token
apiClient.interceptors.request.use(config => {
  
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// 响应拦截器：处理 token 过期自动刷新
apiClient.interceptors.response.use(
  response => {

    const contentType = response.headers['content-type'] || ''

    // 如果是文件流，直接返回 response，不解析
    if (contentType.includes('application/vnd.openxmlformats') || 
        contentType.includes('application/pdf') || 
        contentType.includes('text/csv') ||
        contentType.includes('application/zip')) {
      return response // 返回原始 response，由 download 处理
    }

    const res = response.data
    if (res.code === 200) {
      return res 
    }

    const authStore = useAuthStore()

    switch (res.code) {
      case 401:
        ElMessage.error({
          message: '登录已过期，请重新登录',
          duration: 3000,
          onClose: () => {
            authStore.clearTokens()
            // 跳转登录页（注意：这里不能直接用 router，需延迟或单独处理）
            window.location.href = '/login' // 强制跳转，避免死循环
          },
        })
        break

      case 403:
        ElMessage.warning({
          message: '没有权限访问该资源',
          duration: 2500,
        })
        break

      case 500:
        ElMessage.error({
          message: res.msg || '服务器内部错误',
          duration: 3000,
        })
        break

      default:
        // 其他业务错误
        ElMessage.error({
          message: res.msg || '请求失败',
          duration: 2500,
        })
        break
    }

    // ❗统一抛出错误，让调用方可以 catch
    return Promise.reject(new Error(res.msg || 'Error'))
  },

  // 👉 3. 网络错误 / 请求未发出（如超时、断网、CORS）
  (error) => {
    console.error('【请求错误】', error)

    // 处理不同类型的网络异常
    if (error.message === 'Network Error') {
      ElMessage.error({
        message: '网络连接失败，请检查网络',
        duration: 3000,
      })
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error({
        message: '请求超时，请稍后重试',
        duration: 3000,
      })
    } else if (error.response) {
      // 服务器返回了状态码，但不在 2xx 范围（如 500、404）
      const { status } = error.response
      if (status >= 500) {
        ElMessage.error({
          message: '服务器繁忙，请稍后再试',
          duration: 3000,
        })
      } else if (status === 404) {
        ElMessage.error({
          message: '请求的资源不存在',
          duration: 2500,
        })
      }
    } else {
      ElMessage.error({
        message: '未知错误，请刷新重试',
        duration: 2500,
      })
    }

    return Promise.reject(error)
  }
)

export default apiClient