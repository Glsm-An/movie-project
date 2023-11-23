import axios from "axios";

export const getCiemasScreen = async (offset,districtId,lineId,hallType,brandId,serviceId,stationId,cityId) => {
    let { data } = await axios.get(`https://apic.netstart.cn/maoyan/index/moreCinemas?offset=${offset}&limit=10&districtId=${districtId}&lineId=${lineId}&hallType=${hallType}&brandId=${brandId}&serviceId=${serviceId}&stationId=${stationId}&cityId=${cityId}`);
    return data;
}

export const getSubwayCiemas = async (offset,hallType,brandId,serviceId,stationId,cityId) => {
    let { data } = await axios.get(`https://apic.netstart.cn/maoyan/index/moreCinemas?offset=${offset}&hallType=${hallType}&brandId=${brandId}&serviceId=${serviceId}&stationId=${stationId}&cityId=${cityId}`);
    return data;
}
