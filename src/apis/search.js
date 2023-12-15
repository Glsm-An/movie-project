import axios from "axios"

export const getSearch = async (keywords,id) => {
    let{data} = await axios.get(`https://apis.netstart.cn/maoyan/search/suggest?kw=${keywords}&cityId=${id}`)
    return data
}

export const getcinemas = async (keywords,id) => {
    let{data} = await axios.get(`https://apis.netstart.cn/maoyan/search/cinemas?keyword=${keywords}&ci=${id}`)
    return data
}
