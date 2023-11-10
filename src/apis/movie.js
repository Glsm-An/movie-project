import axios from "axios";

export const getGoodMovie = async() =>{
    let {data} = await axios.get(`https://apis.netstart.cn/maoyan/index/topRatedMovies`);
    console.log(data);
    return data
}