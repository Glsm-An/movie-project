import axios from "axios";
export const getShortVideo = async (random) => {
    let { data } = await axios.get(`https://apic.netstart.cn/maoyan/video/short/${random}`);
    return data;
}