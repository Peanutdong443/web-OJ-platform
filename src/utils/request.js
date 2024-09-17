import axios from 'axios'
import {
  Notification,
  MessageBox,
  Message
} from 'element-ui'

function getToken() {
  return localStorage.getItem("token");
}
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: '/labor',
  // 超时
  timeout: 180000
})
// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  config.headers['content-type'] = 'application/x-www-form-urlencoded'
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }

  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  //console.log("响应", res);
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const msg = res.data.msg
  if (res.data && res.data instanceof Blob) {
    res.data.headers = res.headers;
  }
  if (code === 401) {

    Message({
      message: '登录已过期，请重新登录',
      type: 'error'
    })
    setTimeout(() => {
      localStorage.clear()
      location.href = '/';
    }, 1500)

  } else if (code === 500) {
    Message({
      message: msg,
      type: 'error'
    })
    return Promise.reject(new Error(msg))
  } else if (code !== 200) {
    //console.log("code", code);
    Message({
      message: msg,
      type: 'error'
    })
    return Promise.reject('error')
  } else {
    return res.data
  }
},
  error => {
    console.log('err' + error)
    let {
      message
    } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
