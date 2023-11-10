<template>
    <div class="movie">
        <div class="home-screen">
            <div class="left-select">
                <span class="city">广州</span>
                <van-icon name="play" size="8" color="#666" />
            </div>
            <van-tabs class="tabbar" v-model="active" line-width="21" :ellipsis=false>
                <van-tab to="/" title="热映"></van-tab>
                <van-tab to="/cinema" title="影院"></van-tab>
                <van-tab to="/awaitMovie" title="待映"></van-tab>
                <van-tab to="/sutraMovie" title="经典电影"></van-tab>
            </van-tabs>
            <div>
                <van-icon name="search" color="#EF4238" />
            </div>
        </div>

        <!-- 最受好评电影 -->
        <div class="good-movie">
            <p class="title">{{ title }}</p>
            <van-grid :gutter="10">
                <van-grid-item v-for="value in 8" :key="value" icon="photo-o" text="文字" />
            </van-grid>
        </div>
    </div>
</template>


<script>
import { getGoodMovie } from "../apis/movie"
const activeIndex = {
    movie: 0,
    cinema: 1,
    awaitMovie: 2,
    sutraMovie: 3
}
export default {
    data() {
        return {
            title: '',
            goodmovielist: []
        }
    },
    async mounted() {
        let { title, movieLis } = await getGoodMovie();
        this.title = title;
        this.goodmovielist = movieLis
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
    },
}
</script>

<style lang="scss">
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
        font-weight: 700;
    }

    .van-tabs__line {
        background-color: #f03d37;
    }
}

.good-movie {
    padding: 12px 15px;
    background-color: #fff;
    margin-bottom: 10px;

    .title {
        font-size: 14px;
        color: #333;
        margin: 0 0 12px;
    }
}
</style>