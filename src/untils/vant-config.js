import { Tabbar, TabbarItem, Icon, Popover, NavBar, Tab, Tabs, Grid, GridItem } from 'vant';

export default {
    install(Vue) {
        Vue.use(Tabbar)
        Vue.use(TabbarItem)
        Vue.use(Icon)
        Vue.use(Popover)
        Vue.use(NavBar)
        Vue.use(Tab)
        Vue.use(Tabs)
        Vue.use(Grid);
        Vue.use(GridItem);
    }
}