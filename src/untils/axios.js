import axios from "axios";


const Axios = (
    () => {

        let instance = null

        return class Axios {

            constructor() {
                if (!instance) {
                    instance = axios.create()
                    // 拦截器的意义
                    // 请求拦截器
                    instance.interceptors.request.use(function (config) {
                        // 在发送请求之前做些什么
                        // console.log('axios发起请求被我拦截了', config);

                        // const token = localStorage.token || 'sj9sd73ns-0sjds8sdjd8'

                        // config.headers.token = token

                        return config;
                    }, function (error) {
                        // 对请求错误做些什么
                        return Promise.reject(error);
                    });

                    // 添加响应拦截器
                    instance.interceptors.response.use(function (response) {
                        // 2xx 范围内的状态码都会触发该函数。
                        // 对响应数据做点什么
                        // console.log('数据请求成功返回的res进入了拦截器',response);

                        return response;
                    }, function (error) {
                        // 超出 2xx 范围的状态码都会触发该函数。
                        // 对响应错误做点什么
                        return Promise.reject(error);
                    });
                }
            }

            async get(url) {
                console.log('发送请求');
                const res = await instance.get(url)
                return res
            }

        }

    }
)()

export default new Axios()

