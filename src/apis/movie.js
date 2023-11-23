import axios from "axios";

export const getGoodMovie = async () => {
    let { data } = await axios.get(`https://apic.netstart.cn/maoyan/index/topRatedMovies`);
    return data;
}

export const getAwaitMovie = async (id) => {
    let { data } = await axios.get(`https://apic.netstart.cn/maoyan/movie/intro?movieId=${id}`);
    return data;
}

export const getHotMovie = async () => {
    let { data } = await axios.get(`https://apic.netstart.cn/maoyan/index/movieOnInfoList`);
    return data
}

export const getMoreHotMovie = async(str) =>{
    let { data } = await axios.get(`https://apic.netstart.cn/maoyan/index/moreComingList?movieIds=${str}`) 
    return data
}
