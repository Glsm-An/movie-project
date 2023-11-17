import axios from "axios";

let random = Math.floor(Math.random() * 99)+1;
export const getShortVideo = async () => {
    let { data } = await axios.get(`https://apis.netstart.cn/maoyan/video/short/${random}`);
    return data;
}