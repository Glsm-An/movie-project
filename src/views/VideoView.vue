<template>
    <div>
        <div class="home-screen">
            <van-tabs class="tabbar" v-model="active" line-width="21" :ellipsis=false>
                <van-tab :to="{ name: 'recommend' }" title="推荐"></van-tab>
                <van-tab :to="{ name: 'hotvideo' }" title="热片解读"></van-tab>
                <van-tab :to="{ name: 'newvideo' }" title="新片预告"></van-tab>
                <van-tab :to="{ name: 'quickmovie' }" title="速看电影"></van-tab>
            </van-tabs>

        </div>
        <router-view></router-view>
    </div>
</template>

<script>
const activeIndex = {
    recommend: 0,
    hotvideo: 1,
    newvideo: 2,
    quickmovie: 3
}
export default {
    data() {
        return{
            
        }
    },
    computed: {
        active: {
            get() {
                const { name } = this.$route;
                const index = activeIndex[name] || 0;
                return index;
            },
            set() { },
        },
    }

}
</script>