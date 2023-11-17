<template>
    <div :style="{ backgroundColor: movie.backgroundColor }">
        <div class="movie-info">
            <!-- 标题 -->
            <div class="crumbs-nav">
                <a href="/">猫眼电影</a>
                >
                <span>{{ movie.nm }}</span>
            </div>
            <!-- 电影介绍 -->
            <div class="movie-info-top">
                <!-- 左侧图片 -->
                <div class="movie-cover">
                    <img :src="movie.img">
                </div>
                <div class="movie-desc">
                    <h3>{{ movie.nm }}</h3>
                    <p>{{ movie.enm }}</p>
                    <!-- 电影信息 -->
                    <div class="movie-other-info">
                        <!-- 电影类型 -->
                        <div class="movie-type">
                            <span class="type">{{ type }}</span>
                            <span class="imax" v-if="movie.comScorePersona"><img src="../assets/2D-IMAX.png"></span>
                        </div>
                        <p>{{ star }}</p>
                        <p>{{ movie.onlineDate }} / {{ movie.dur }}分钟</p>
                    </div>
                    <div class="btns">
                        <van-button @click="setWish"
                            icon="https://obj.pipi.cn/festatic/asgard/resources/images/movie/want-to-watch.png" type="info"
                            color="hsla(0,0%,100%,.35)">
                            想看
                        </van-button>
                        <van-button @click="setWatched" v-if="movie.globalReleased"
                            icon="https://obj.pipi.cn/festatic/asgard/resources/images/movie/star.png" type="info"
                            color="hsla(0,0%,100%,.35)">
                            看过
                        </van-button>
                    </div>
                </div>
            </div>
            <!-- 电影评分 -->
            <div class="score-container-wrap">
                <div class="real-time-word-of-mouth" v-if="movie.globalReleased">
                    <div class="top">
                        <div class="left">
                            <img src="../assets/logo-new.png" alt="">
                            <span>{{ movie.scoreLabel }}</span>
                        </div>
                        <div class="right">
                            <div class="num">{{ wish }}</div>
                            <div class="num watched">{{ watched }}</div>
                            <van-icon name="arrow" size="9" />
                        </div>
                    </div>
                    <div class="middle">
                        <div class="left-section">
                            <div class="left">
                                <span class="score-sc">
                                    {{ movie.sc }}
                                </span>
                                <div class="people-grade">{{ snum }}</div>
                            </div>
                            <div class="right">
                                <div class="stars-percent-bar">
                                    <div class="stars"><van-rate v-model="five" readonly size="5" void-color="#3C2F21"
                                            color="#5D5246" gutter="1" /></div>
                                    <div class="bar">
                                        <van-progress :percentage="(distribution[0].percent * 100)" stroke-width="3"
                                            color="#7A7168" track-color="#403326" :show-pivot="false" />
                                    </div>
                                </div>
                                <div class="stars-percent-bar">
                                    <div class="stars"><van-rate v-model="four" readonly size="5" void-color="#3C2F21"
                                            color="#5D5246" gutter="1" /></div>
                                    <div class="bar">
                                        <van-progress :percentage="(distribution[1].percent * 100)" stroke-width="3"
                                            color="#7A7168" track-color="#403326" :show-pivot="false" />
                                    </div>
                                </div>
                                <div class="stars-percent-bar">
                                    <div class="stars"><van-rate v-model="three" readonly size="5" void-color="#3C2F21"
                                            color="#5D5246" gutter="1" /></div>
                                    <div class="bar">
                                        <van-progress :percentage="(distribution[2].percent * 100)" stroke-width="3"
                                            color="#7A7168" track-color="#403326" :show-pivot="false" />
                                    </div>
                                </div>
                                <div class="stars-percent-bar">
                                    <div class="stars"><van-rate v-model="two" readonly size="5" void-color="#3C2F21"
                                            color="#5D5246" gutter="1" /></div>
                                    <div class="bar">
                                        <van-progress :percentage="(distribution[3].percent * 100)" stroke-width="3"
                                            color="#7A7168" track-color="#403326" :show-pivot="false" />
                                    </div>
                                </div>
                                <div class="stars-percent-bar">
                                    <div class="stars"><van-rate v-model="one" readonly size="5" void-color="#3C2F21"
                                            color="#5D5246" gutter="1" /></div>
                                    <div class="bar">
                                        <van-progress :percentage="(distribution[4].percent * 100)" stroke-width="3"
                                            color="#7A7168" track-color="#403326" :show-pivot="false" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="right-reputation" v-if="reputation.movieRank">
                            <div class="reputation-box">
                                <img class="img-nobg" src="../assets/top3-reputation.png">
                                <div class="rank">
                                    <span class="top">TOP</span>
                                    <span class="rank-num">{{ reputation.movieRank }}</span>
                                </div>
                                <div class="desc"><span class="first-word">{{ reputation.firstWord }}</span><span
                                        class="second-word">{{ reputation.secondWord }}</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="awardBottom" v-if="movie.scm">
                        <div class="awards-box">
                            <img src="../assets/zan.png">
                            <span class="awardDetail">{{ movie.scm }}</span>
                        </div>
                    </div>
                </div>
                <!-- 未上映电影,想看页面 -->
                <div class="real-time-word" v-else>
                    <div class="top">
                        <div class="left">
                            <img src="../assets/logo-new.png" alt="">
                            <span>猫眼想看</span>
                        </div>
                    </div>
                    <div class="middle">
                        <div class="score">
                            <span class="wish">{{ realtime.wish }}</span>
                            <span class="txt">人想看</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 电影简介 -->
            <div>
                <van-collapse v-model="activeNames" :border="false">
                    <van-collapse-item title="简介" name="1" value="展开" :border="false">
                        {{ briefIntroduction }}
                    </van-collapse-item>
                </van-collapse>
            </div>
            <!-- 宣传片 -->
            <div class="videos">
                <p>宣传片</p>
                <div class="videos-list">
                    <video :src="movie.videourl" :poster="movie.videoImg" width="100%" height="200px" autoplay controls
                        preload></video>
                </div>
            </div>
            <!-- 演职人员 -->
            <div class="actors">
                <p>剧照</p>
                <template>
                    <el-carousel :interval="3000" type="card" indicator-position="none">
                        <el-carousel-item v-for="item in celebrities" :key="item.id">
                            <!-- <h3 class="medium">{{ item }}</h3> -->
                            <div class="banner">
                                <img :src="item.avatar">
                                <p class="name">{{ item.cnm }}</p>
                                <p class="role">{{ item.desc }}</p>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </template>
            </div>
            <!-- 剧照 -->
            <div class="photos">
                <p>剧照</p>
                <!-- <template>
                    <el-carousel :interval="3000" type="card" height="200px" indicator-position="none">
                        <el-carousel-item v-for="item in movie.photos" :key="item">
                          <img :src="item">
                        </el-carousel-item>
                    </el-carousel>
                </template> -->

                <template>
                    <el-carousel :interval="3000" arrow="always" indicator-position="none" height="180px">
                        <el-carousel-item v-for="item in movie.photos" :key="item">
                          <img :src="item">
                        </el-carousel-item>
                    </el-carousel>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { getMovieDetail } from '../apis/movieDetails'
export default {
    props: ["id"],
    data() {
        return {
            movie: [],
            distribution: [],
            one: 1,
            two: 2,
            three: 3,
            four: 4,
            five: 5,
            wishflag: false,
            watchedflag: false,
            reputation: [],
            realtime: '',
            activeNames: [""],
            celebrities: []
        }
    },
    mounted() {

        // this.setId();
        this.getMovieDetail();
    },
    computed: {
        // ids() {
        //     return this.$route.query.id
        // },
        type() {
            return this.movie.cat?.split(",").join("/");
        },
        star() {
            return this.movie.star?.split(",").join("/");
        },
        wish() {
            return `${this.movie.wish.toLocaleString()} 人想看`
        },
        watched() {
            return `${this.movie.watched.toLocaleString()} 人看过`
        },
        snum() {
            return `${this.movie.snum.toLocaleString()} 人评`
        },
        briefIntroduction() {
            return this.movie.shareInfo?.content.slice(3);
        }
    },
    methods: {
        async getMovieDetail() {
            let { movie, distribution, reputation, realtime, celebrities } = await getMovieDetail(this.id);
            this.movie = movie;
            this.distribution = distribution;
            this.reputation = reputation;
            this.realtime = realtime;
            this.celebrities = celebrities;
            console.log(movie);
        },
        setWish() {
            if (this.wishflag == false) {
                this.movie.wish += 1;
                this.realtime.wish += 1;
                this.wishflag = true;
            } else {
                this.movie.wish -= 1;
                this.realtime.wish -= 1;
                this.wishflag = false;
            }
            // console.log(this.wishflag);
        },
        setWatched() {
            if (this.watchedflag == false) {
                this.movie.watched += 1;
                this.watchedflag = true;
            } else {
                this.movie.watched -= 1;
                this.watchedflag = false;
            }
        },
        // setId(){
        //     this.id = this.$route.query.id
        // }
    },
    watch: {
        "id": {
            immediate: true,
            handler() {
                // console.log("aaa");
                this.movie = "";
                this.distribution = "";
                this.reputation = "";
                this.realtime = "";
                this.celebrities = "";
                this.getMovieDetail();
            }
        }

    }
}
</script>

<style lang="scss">
.movie-info {
    padding: 21px 16px;
    color: #fff;
    position: relative;

    .crumbs-nav {
        margin-bottom: 15px;
        color: #ccc;

        a {
            text-decoration: none;
            color: inherit;
        }
    }
}

.movie-info-top {
    overflow: hidden;
    display: flex;
    justify-content: flex-start;

    .movie-cover {
        float: left;
        height: 138px;
        width: 100px;
        position: relative;

        // flex-shrink: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }

    .movie-desc {
        flex-grow: 1;
        margin-left: 12px;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        overflow: hidden;

        h3 {
            font-size: 20px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        p {
            font-size: 12px;
            opacity: .6;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
}

.movie-type {
    font-size: 12px;
    display: flex;
    align-items: center;

    .type {
        opacity: .6;
    }

    .imax {
        border-radius: 2px;
        margin-left: 4px;
        vertical-align: text-bottom;
        display: flex;
        align-items: center;

        img {
            width: 40px;
            height: 14px;
        }
    }


}

.btns {
    display: flex;
    justify-content: space-between;

    .van-button {
        border-radius: 4px;
        font-size: 14px;
        width: 47.61904762%;
        height: 30px;
        color: #fff;
        border: none;
    }

}

.real-time-word-of-mouth {
    background-color: rgba(0, 0, 0, .18);
    border-radius: 8px;
    margin-top: 15px;
    padding: 9px 10px 10px 0;
    box-sizing: border-box;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular;
    padding-left: 10px;

    .left {
        font-size: 12px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-weight: 400;

        img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
        }
    }

    .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 11px;
        margin-right: 2px;
        opacity: .6;
        transform: translateY(0.5px);
    }

    .van-icon {
        opacity: .6;
        transform: translateY(0.7px);
        margin-left: 2px;
    }

    .watched {
        margin-left: 13px;
    }
}

.middle {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 11px 0 3px;
    height: 50px;

    .left-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
    }

    .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        margin-right: 4px;

        .score-sc {
            display: inline-block;
            font-weight: 600;
            font-family: MaoYanHeiTi-H-H;
            font-size: 26px;
            color: #ffb400;
            line-height: 26px;
            letter-spacing: 0;
            text-align: center;
            margin-bottom: 4px;
        }

        .people-grade {
            font-weight: 400;
            opacity: .6;
            font-family: PingFangSC-Regular;
            font-size: 20px;
            display: flex;
            word-break: keep-all;
            color: hsla(0, 0%, 100%, .4);
            letter-spacing: 0;
            text-align: center;
            line-height: 10px;
            zoom: .5;
        }
    }

    .stars-percent-bar {
        display: flex;
        align-items: center;
        margin-bottom: 3px;
        height: 5px;

        .stars {
            width: 35px;
        }

        .bar {
            width: 71px;
            height: 4px;
            background-color: hsla(0, 0%, 100%, .06);
            border-radius: 1px;
            margin-left: 4px;
            transform: translateY(4px);
        }
    }
}

.right-reputation {
    margin-right: 5px;
    width: 120px;
    display: flex;
    justify-content: flex-end;
    align-self: center;

    .reputation-box {
        width: 120px;
        height: 44px;
        box-sizing: border-box;
        background-image: linear-gradient(270deg, rgba(0, 0, 0, .04), rgba(226, 177, 117, .11));
        border-radius: 6px;
        padding: 4px;
        position: relative;

        .img-nobg {
            width: 29px;
            height: 36px;
            background: none;
        }

        .rank {
            position: absolute;
            left: 0;
            top: 9px;
            display: flex;
            flex-direction: column;
            font-family: PingFangSC-Medium;
            width: 29px;
            margin-left: 4px;
        }

        &::after {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 200%;
            height: 200%;
            border: 1px solid #b49c70;
            content: "";
            transform: scale(.5);
            transform-origin: 0 0;
            border-radius: 12px;
        }
    }
}

.rank {
    position: absolute;
    left: 0;
    top: 9px;
    display: flex;
    flex-direction: column;
    font-family: PingFangSC-Medium;
    width: 29px;
    margin-left: 4px;

    .top {
        font-size: 18px;
        line-height: 10px;
        font-weight: 600;
        text-shadow: 0 1px 4px #8e5d25;
        font-family: PingFangSC-Semibold;
        color: rgba(255, 229, 150, .7);
        letter-spacing: 0;
        transform: scale(.5);
        width: 19px;
        transform-origin: 50%;
    }

    .rank-num {
        font-size: 15px;
        line-height: 13px;
        font-family: MaoYanHeiTi-H-H;
        color: #ffe186;
        letter-spacing: 0;
        text-align: center;
        margin-top: 3px;
    }
}

.desc {
    position: absolute;
    left: 38px;
    top: 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;
    width: 85px;

    .first-word {
        font-weight: 400;
        font-family: PingFangSC-Regular;
        opacity: .7;
        font-size: 20px;
        color: #ffeec1;
        letter-spacing: 0;
        height: 13px;
        line-height: 13px;
        transform: scale(.5);
        transform-origin: 0;
    }

    .second-word {
        font-weight: 500;
        font-family: PingFangSC-Medium;
        color: #fff4bd;
        letter-spacing: 0;
        line-height: 14px;
        height: 14px;
        text-shadow: 0 1px 3px rgba(166, 97, 48, .5);
        font-size: 22px;
        transform: scale(.5);
        transform-origin: 0;
    }
}

.real-time-word {
    background-color: rgba(0, 0, 0, .18);
    border-radius: 8px;
    margin-top: 15px;
    padding: 9px 10px 10px 0;
    box-sizing: border-box;
    position: relative;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: PingFangSC-Regular;
        padding-left: 10px;

        .left {
            font-size: 12px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-weight: 400;
        }
    }

    .score {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
        font-weight: 600;
        font-family: MaoYanHeiTi-H-H;
        font-size: 26px;
        color: #ffb400;
        line-height: 26px;
        letter-spacing: 0;
        text-align: center;
        margin-bottom: 4px;

        .txt {
            margin-left: 5px;
            font-size: 12px;
            color: #fff;
            opacity: .8
        }
    }
}

.awardBottom {
    margin-top: 7px;
    background: rgba(0, 0, 0, .12);
    border-radius: 6px;
    padding: 0 5px 0 11px;
    margin-left: 10px;
    font-size: 12px;
    color: #fffadf;
    text-shadow: 0 1px 3px rgba(166, 97, 48, .5);

    .awards-box {
        position: relative;
        height: 28px;
        white-space: nowrap;
        opacity: 1;
        display: flex;
        align-items: center;

        img {
            width: 15px;
            height: 15px;
            margin-right: 7px;
        }

        .awardDetail {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            min-width: 170px;
        }
    }
}

.van-cell {
    margin-top: 15px;
    background: none;
    color: #fff;
    // border: none;
    font-size: 15px;
    padding-left: 0;
}

.van-collapse-item__content {
    padding: 12px 16px;
    color: #fff;
    font-size: 14px;
    line-height: 1.5;
    background: none;
}

.collapse-item-content-background-color {
    background: none;
}

.videos {
    margin-top: 18px;

    .videos-list {
        margin-top: 11px;
    }
}

.actors {
    .el-carousel {
        width: 82vw;
        transform: translateX(13%);
    }

    .el-carousel__mask {
        height: 200px;
        background: none;
    }

    .el-carousel__item {
        img {
            width: 70%;
            // width: 118px;
            height: 50%;
            // opacity: 0.75;
        }

        p {
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            // text-align: center;
            margin-left: 30px;
        }

        .role {
            opacity: .4;
        }
    }

    .el-carousel__item .el-carousel__item--card {
        height: 200px;
    }

}
.photos{
    .el-carousel__container{
        margin-top: 10px;
    }
    .el-carousel__item{
        img{
            width: 100%;
            height: 100%;
        }
    } 
}
</style>