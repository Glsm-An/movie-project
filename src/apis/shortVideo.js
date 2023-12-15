import axios from "axios";
export const getShortVideo = async (random) => {
    let { data } = await axios.get(`https://apis.netstart.cn/maoyan/video/short/${random}`);
    return data;
}