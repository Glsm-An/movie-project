import axios from '../untils/axios'

export default {
    async getCityArr({ commit }) {
        const { data } = await axios.get('https://apic.netstart.cn/maoyan/cities.json')
        commit('setHotCityArr',data.hot)
        commit('setCityArr', data.cts)
    }
}