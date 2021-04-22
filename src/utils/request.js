import store from '@/store'
import router, { resetRouter } from "@/router/index";
import axios from "axios";
import { Message, MessageBox } from "element-ui";
import { clearSession, getSession } from "@/utils/storage";

const service = axios.create({
	// baseURL: process.env.VUE_APP_BASE_API,
	// timeout: 50000,
	// headers: { "Content-Type": "application/json" }
});

/** global config */
service.defaults.baseURL = process.env.API_HOST;
service.defaults.headers.post['Content-Type'] = 'application/json';
service.defaults.timeout = 30000;
service.defaults.withCredentials = true;//Send cross-domain request credentials

let count = 0;

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
        count++;
        // 在发送请求之前做些什么 token
		if (getSession("token")) {
			config.headers.common["Authorization"] = `${getSession("token")}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
        count--;
        // 对响应数据做点什么
		const res = response.data;
		if (res.code && res.code !== 0) {
			// `token` 过期或者账号已在别处登录
			if (res.code === 401 || res.code === 4001) {
				// 清除浏览器全部临时缓存
				clearSession();
				router.push("/login");
				store.commit('setMenuData', {})
				resetRouter() // 重置路由
				MessageBox.alert('你已被登出，请重新登录', '提示', {}).then(() => { }).catch(() => { });
			}
			return Promise.reject(service.interceptors.response.error);
		} else {
			return response.data;
		}
	},
	(error) => {
        count--;
        if (error && error.response) {
            switch (error.response.status) {
                case 302:
                    error.message = '未授权，请重新登录';
                    clearSession();
                    router.push("/login");
                    store.commit('setMenuData', {})
                    resetRouter()
                    break;
                case 400:
                    error.message = '错误请求'
                    break;
                case 401:
                    error.message = '授权错误，请重新登录';
                    clearSession();
                    router.push("/login");
                    store.commit('setMenuData', {})
                    resetRouter()
                    break;
                case 403:
                    error.message = '登录过期，拒绝访问'
                    clearSession();
                    router.push("/login");
                    store.commit('setMenuData', {})
                    resetRouter() // 重置路由
                    break;
                case 404:
                    error.message = '请求错误，未找到该资源'
                    break;
                case 405:
                    error.message = '请求方法未允许'
                    break;
                case 408:
                    error.message = '请求超时'
                    break;
                case 500:
                    error.message = '服务器出错'
                    break;
                case 501:
                    error.message = '网络未实现'
                    break;
                case 502:
                    error.message = '网络错误,服务更新中...'
                    break;
                case 503:
                    error.message = '服务不可用'
                    break;
                case 504:
                    error.message = '网络超时'
                    break;
                case 505:
                    error.message = 'http版本不支持该请求'
                    break;
                default:
                    error.message = `连接错误${error.response.status}`
                    break;
            }
        }else {// 跨域获取不到状态码或者其他状态码进行的处理
            error.message = '遇到点问题'
        }

        if(count === 0){
            Message.error(error.message);
        }

		// 对响应错误做点什么
		// if (error.message.indexOf("timeout") != -1) {
		// 	Message.error("网络超时");
		// } else if (error.message == "Network Error") {
		// 	Message.error("网络连接错误");
		// } else {
		// 	Message.error(error.response.data.message);
		// }
		return Promise.reject(error);
	}
);

export default service;
