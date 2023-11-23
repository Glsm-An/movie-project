import axios from "axios";

export const getVideo = async () => {
    let { data } = await axios.get(`https://apic.netstart.cn/maoyan/video/0`);
    return data;
}