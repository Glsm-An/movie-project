import { Button, Carousel, CarouselItem, Backtop, Form,
    FormItem,  Input} from 'element-ui';


export default {
    install(Vue) {
        Vue.use(Button)
        Vue.use(Carousel)
        Vue.use(CarouselItem)
        Vue.use(Backtop)
        Vue.use(Form)
        Vue.use(FormItem)
        Vue.use(Input)
    }
}