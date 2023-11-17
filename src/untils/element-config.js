import { Button, Carousel, CarouselItem, } from 'element-ui';


export default {
    install(Vue) {
        Vue.use(Button)
        Vue.use(Carousel)
        Vue.use(CarouselItem)
    }
}