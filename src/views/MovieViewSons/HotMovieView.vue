<template>
    <div class="hot-movie">
        <GoTop />
        <!-- 最受好评电影 -->
        <div class="good-movie">
            <p class="title">{{ title }}</p>
            <div class="top-rated-list">

                <div class="bg-img" v-for="g in goodmovielist" :key="g.movieId" @click="onMovie(g.movieId)">
                    <img :src="g.poster" :alt="g.name">
                    <span class="wish-bg"></span>
                    <span class="score" v-if="g.score">观众评分&nbsp;&nbsp; {{ g.score }}</span>
                    <MovieWish v-else :id="g.movieId" />
                    <h5 class="movie-name">{{ g.name }}</h5>
                </div>
            </div>
        </div>
        <!-- 近日热播 -->
        <div>
            <van-list v-model="loading" :finished="finished" finished-text="我也是有底线的o(〃＾▽＾〃)o" @load="onLoad">
                <!-- <div class="main-block" v-for="h in hotMovieList" :key="h.id"> -->
                <router-link class="main-block" tag="div" v-for="h in hotMovieList" :key="h.id"
                    :to="{ name: 'moviedetails', query: { id: h.id } }">
                    <div class="avatar">
                        <div class="default-img-bg">
                            <img :src="h.img">
                        </div>
                    </div>
                    <div class="mb-outline-b content-wrapper">
                        <div class="column content">
                            <div class="box-flex movie-title">
                                <div class="title line-ellipsis v2dimax_title">{{ h.nm }}</div>
                                <span v-show="h.version" class="version v2d imax"></span>
                            </div>
                            <div class="detail column">
                                <div class="score line-ellipsis" v-if="h.sc">
                                    <span class="score-suffix">观众评 </span>
                                    <span class="grade">{{ h.sc.toFixed(1) }}</span>
                                </div>
                                <div class="score line-ellipsis" v-else>
                                    <span class="grade">{{ h.wish }}</span>
                                    <span class="score-suffix">人想看</span>
                                </div>

                                <div class="actor line-ellipsis">主演:{{ h.star }}</div>
                                <div class="show-info line-ellipsis">{{ h.showInfo }}</div>
                            </div>
                        </div>
                        <div class="button-block">
                            <div class="btn normal"
                                style="background-color:#F03D37;box-shadow:0 0.04rem 0.04rem 0 rgba(240,61,55, 0.15)" v-if="h.showStateButton.content == '购票' ">
                                <span class="fix">{{ h.showStateButton.content }}</span>
                            </div>

                            <div class="btn normal"
                                style="background-color:#3C9FE6;box-shadow:0 0.04rem 0.04rem 0 rgba(60,159,230, 0.15)" v-else>
                                <span class="fix">{{ h.showStateButton.content }}</span>
                            </div>
                        </div>
                    </div>
                </router-link>
                <!-- </div> -->
            </van-list>
        </div>
    </div>
</template>

<script>
import MovieWish from "../../components/MovieWish.vue"
import { getGoodMovie, getHotMovie, getMoreHotMovie } from "../../apis/movie"
import GoTop from "../../components/GoTop.vue"
// getAwaitMovie
export default {
    props: ['id'],
    data() {
        return {
            title: '',
            goodmovielist: [],
            hotMovieList: [],
            loading: false,
            finished: false,
            hotMovieArr: [],
            newHotMovieId: [],
            count: 0,
            str: ''
        };
    },
    mounted() {
        this.getGoodMovie();
        this.getHotMovie();
        //    this.getAwaitMovie();
        //    console.log(this.id);
    },
    methods: {
        async getGoodMovie() {
            let { title, movieList } = await getGoodMovie();
            this.title = title;
            this.goodmovielist = movieList;
        },
        async getHotMovie() {
            let { movieList, movieIds } = await getHotMovie();
            this.hotMovieList = movieList;
            this.hotMovieArr = movieIds;
            this.newHotMovieId = movieIds.slice(12);
        },
        async getMoreHotMovie() {
            let data = await getMoreHotMovie(this.str);
            data.coming.map(item => {
                this.hotMovieList.push(item);
            })
        },
        onMovie(id) {
            this.$router.push({
                name: 'moviedetails',
                query: {
                    id
                }
            })
        },
        onLoad() {

            let endCount = 0;

            // setTimeout 仅做示例，真实场景中一般为 ajax 请求


            setTimeout(() => {

                if (endCount < this.newHotMovieId.length) {
                    this.count += 10;
                    endCount = this.count + 10;
                }
                if (endCount >= this.newHotMovieId.length) {
                    endCount = this.newHotMovieId.length;
                }
                if(this.count > endCount){
                    // this.count = null;
                    // this.str = "";
                    endCount = null;
                }
                // this.count = null;
                // console.log("count",this.count);
                // console.log("end",endCount);

                this.str = String(this.newHotMovieId.slice(this.count, endCount));
                // console.log(this.str);

                this.getMoreHotMovie()
                this.loading = false;

                // 数据全部加载完成
                if (endCount == null) {
                    this.finished = true;
                }
            }, 3000);
        },
    },
    components: {
        MovieWish,
        GoTop
    },

}
</script>

<style lang="scss">
.hot-movie {
    background-color: #f5f5f5;
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

    .top-rated-list {
        overflow: scroll;
        white-space: nowrap;

        &::-webkit-scrollbar {
            height: 0px;
        }

        .wish-bg {
            display: inline-block;
            width: 100%;
            height: 35px;
            position: absolute;
            bottom: 0;
            background-image: linear-gradient(-180deg, rgba(77, 77, 77, 0), #000);
        }

        .score {
            position: absolute;
            left: 4px;
            bottom: 2px;
            color: #faaf00;
            font-size: 11px;
            font-weight: 600;
        }
    }

    .bg-img {
        display: inline-block;
        width: 85px;
        height: 115px;
        position: relative;
        margin-bottom: 6px;
        margin-right: 7px;

        img {
            height: 100%;
            width: 100%;
            display: block;
        }
    }

}

.van-tab--active {
    .van-tab__text {

        font-size: 18px;

    }
}

.movie-name {
    font-size: 13px;
    color: #222;
    margin: 6px 0 3px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

// 近日热映
.main-block {
    position: relative;
    width: 100%;
    height: 114px;
    padding-left: 15px;

    .avatar {
        width: 64px;
        height: 95px;
        position: relative;
        margin-top: 12px;
        float: left;

        &::after {
            content: "";
            display: block;
            position: absolute;
            width: 46px;
            height: 46px;
            background-repeat: no-repeat;
            background-size: contain;
        }
    }

    .default-img-bg {
        background-color: #e1e1e1;
        background-size: 100% 100%;

        img {
            height: 90px;
        }
    }

    .content-wrapper {
        padding: 12px 14px 12px 0;
        margin-left: 74px;
        height: 114px;
        // max-height: 90px;
        position: relative;
    }

    .content {
        padding-right: 5px;
        margin-right: 48px;
        overflow: hidden;
    }

    .movie-title {
        max-height: 24px;
        margin-bottom: 7px;
        line-height: 24px;
        overflow: hidden;
    }

    .box-flex {
        display: flex;
    }

    .title {
        font-size: 17px;
        color: #333;
        font-weight: 700;
        padding-right: 5px;
        flex-shrink: 1;
    }

    .line-ellipsis {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .version,
    .v2d,
    .imax {
        width: 43px;
        background-image: url("../../assets/2D-IMAX.png");
    }

    .version {
        background-size: contain;
        background-repeat: no-repeat;
        height: 14px;
        display: inline-block;
        margin-top: 5px;
        flex: 0 0 auto;
        margin-right: 3px;
    }

    .detail {
        box-sizing: border-box;
        line-height: 1;
        overflow: hidden;
    }

    .score,
    .actor,
    .show-info {
        font-size: 13px;
        color: #666;
        // margin-bottom: 5px;
        padding: 3px 0;
    }

    .score {
        position: static !important;
    }

    .grade {
        font-weight: 700;
        color: #faaf00;
        font-size: 15px;
    }

    .button-block {
        font-size: 12px;
        position: absolute;
        right: 14px;
        top: 0;
        bottom: 0;
        height: 27px;
        margin: auto;

        .btn {
            width: 54px;
            height: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            // background-color: #f03d37;
            color: #fff;
            white-space: nowrap;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            border-radius: 13.5px
        }
    }

    .mb-outline-b {
        background: url(//obj.pipi.cn/festatic/touchnode/resources/images/dpmmweb/img/base/base64/repeat-x-bottom-outline.png) 0 bottom repeat-x;
    }
}
.van-list{
    margin-bottom: 52px;
}
</style>