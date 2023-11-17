import { Tabbar, TabbarItem, Icon, Popover, NavBar, Tab, Tabs, Grid, GridItem, Image as VanImage, IndexBar, IndexAnchor, Button, Cell, CellGroup, Rate, Progress, Collapse, CollapseItem ,PullRefresh ,Search ,List } from 'vant';

export default {
    install(Vue) {
        Vue.use(Tabbar)
        Vue.use(TabbarItem)
        Vue.use(Icon)
        Vue.use(Popover)
        Vue.use(NavBar)
        Vue.use(Tab)
        Vue.use(Tabs)
        Vue.use(Grid)
        Vue.use(GridItem)
        Vue.use(VanImage)
        Vue.use(IndexBar)
        Vue.use(IndexAnchor)
        Vue.use(Button)
        Vue.use(Cell)
        Vue.use(CellGroup)
        Vue.use(Rate)
        Vue.use(Progress)
        Vue.use(Collapse)
        Vue.use(CollapseItem)
        Vue.use(PullRefresh)
        Vue.use(Search)
        Vue.use(List)
    }
}