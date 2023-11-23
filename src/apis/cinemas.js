import axios from "axios";

export const getCiemas = async (id) => {
    let { data } = await axios.get(`https://apic.netstart.cn/maoyan/index/filterCinemas?ci=${id}`);
    return data;
}

export const getCiemaInformation = async (id) =>{
    let {data} = await axios.get(`https://apic.netstart.cn/maoyan/cinema/detail?cinemaId=${id}`) ;
    return data;
}

export const getCiemaMovie = async (id,cityId) =>{
    let {data} = await axios.get(`https://apic.netstart.cn/maoyan/cinema/shows?cinemaId=${id}&ci=${cityId}&channelId=4`) ;
    return data;
}

