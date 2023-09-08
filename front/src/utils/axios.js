import axios from 'axios'

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    config.baseURL = '/api'
    config.timeout = 5000
    return config
  }, err => {
    // 对请求错误做些什么
    return Promise.reject(err)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data
  }, err => {
    // 对响应错误做点什么
    return Promise.reject(err)
  }
)

export default axios