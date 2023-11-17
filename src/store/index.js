import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentCity: '广州',
    cityId:20,
    cityArr: [],
    hotCity:[]

  },
  mutations: {
    // setCurrentCity(state, city) {
    //   state.city = city
    // },
    setCityArr(state, cityArr) {
      state.cityArr = cityArr
    },
    setHotCityArr(state, hotCity) {
      state.hotCity = hotCity
    },
    setCity(state,{
      currentCity,
      cityId,
    }){
      state.currentCity = currentCity
      state.cityId = cityId
    }
  },
  actions
})

export default store
