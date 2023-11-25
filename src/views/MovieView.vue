<template>
    <div>
        <div class="home-screen">
            <div class="left-select" @click="goCity">
                <span class="city">{{ city.nm }}</span>
                <van-icon name="play" size="8" color="#666" />
            </div>
            <van-tabs class="tabbar" v-model="active" line-width="21" :ellipsis=false>
                <van-tab :to="{ name: 'hotMovie' }" title="热映"></van-tab>
                <van-tab to="/cinema" title="影院"></van-tab>
                <van-tab to="/awaitMovie" title="待映"></van-tab>
                <van-tab to="/sutraMovie" title="经典电影"></van-tab>
            </van-tabs>
         
                <router-link tag="div" :to="{name:'search'}">
                    <van-icon name="search" color="#EF4238" />
                </router-link>
        </div>
        <!-- <HotMovieView /> -->
        <router-view></router-view>
    </div>
</template>


<script>
import { mapState } from 'vuex';
// import HotMovieView from "./MovieViewSons/HotMovieView.vue";
const activeIndex = {
    movie: 0,
    cinema: 1,
    awaitMovie: 2,
    sutraMovie: 3
}
export default {
    // components: { HotMovieView },
    data() {
        return {
            title: '',
            city:{}
        };
    },
    mounted() {
        this.getCity()
    },
    computed: {
        ...mapState(["currentCity"]),
        active: {
            get() {
                const { name } = this.$route;
                const index = activeIndex[name] || 0;
                return index;
            },
            set() { },
        },
    },
    methods:{
        goCity(){
            this.$router.push({
                name:'city-list',
            })
        },
        getCity(){
            this.city = JSON.parse(localStorage.city) 
        }
    },
    watch:{
        currentCity(){
            this.$nextTick(() => {
                this.getCity();
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.home-screen {
    height: 44px;
    border-bottom: 2px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
}

.left-select {
    display: flex;
    align-items: center;

    .city {
        font-size: 18px;
        white-space: nowrap;
    }

    .van-icon-play {
        display: inline-block;
        transform: rotate(90deg);
        height: 8px;
    }

}

.tabbar {
    // min-width: 70vw;
    min-width: 180px;
    border-bottom: 2px solid #e6e6e6;

    .van-tab__text {
        // min-width: 58px;
        font-weight: 500 !important;
    }

    .van-tabs__line {
        background-color: #f03d37;
    }
    // .van-tab--active{
    //     font-weight: 700 !important;
    // }
}
</style>