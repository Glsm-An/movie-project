import axios from "axios";

export const getVideo = async () => {
    let { data } = await axios.get(`https://apis.netstart.cn/maoyan/video/0`);
    return data;
}