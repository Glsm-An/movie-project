import axios from "axios";

export const getMovieDetail = async(id) =>{
    let {data} = await axios.get(`https://apic.netstart.cn/maoyan/movie/detail?movieId=${id}`);
    return data;
}
