<template>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="min-height: 100vh;">
        <div class="short-video-box">

            <div class="short-video-item" v-for="s in shortVideoList" :key="s.id" @click="goShortVideoPlay(s.id)"
                :style="`background-image: url(${s.shareInfo.img});`">
                <div class="title">{{ s.title }}</div>

                <div class="video-info">
                    <div>
                        <van-image round width="21.5px" height="21.5px" :src="s.user.avatarurl" />
                        <div class="user-name">{{ s.user.nickName }}</div>
                    </div>
                    <div>
                        <van-icon name="good-job-o" size="21.5" />
                        <div class="up-count">{{ s.upCount }}</div>
                    </div>
                </div>
            </div>

        </div>
    </van-pull-refresh>
</template>

<script>
import { Toast } from 'vant';
import { getShortVideo } from '../apis/shortVideo'
export default {
    data() {
        return {
            shortVideoList: [],
            isLoading: false,
            timer: null,
        }
    },
    mounted() {
        this.getShortVideo();
    },
    methods: {
        async getShortVideo() {
            let { data } = await getShortVideo();
            this.shortVideoList = data.feeds;
            console.log(data.feeds);
        },
        goShortVideoPlay(id) {
            this.$router.push({
                name: 'shortvideoplay',
                query: {
                    id
                }
            })
        },
        onRefresh() {
            this.shortVideoList = "";
            this.timer = setTimeout(() => {
                Toast('刷新成功');
                this.isLoading = false;
                // this.getShortVideo()
                this.$router.go(0)
            }, 1000);


        },
    },
    beforeDestroy() {
        clearTimeout(this.timer);
        this.timer = null;
    }

}
</script>

<style lang="scss">
.short-video-box {
    margin-bottom: 48px;
}

.short-video-item {
    position: relative;
    display: inline-block;
    width: 49.7%;
    height: 300px;
    margin: 0px 1.875px 2px 0;
    background-position: 50%;
    background-size: cover;

    &:nth-child(even) {
        margin: 0px 0px 2px;
    }

    .title {
        width: 170px;
        margin: 0 8px;
        position: absolute;
        color: #fff;
        font-size: 15px;
        // line-height: 42px;
        line-height: 1.5;
        bottom: 41px;
        text-shadow: 0 0 3px rgba(0, 0, 0, .3);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .video-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 170px;
        margin: 0 8px;
        position: absolute;
        color: #fff;
        background: rgba(0, 0, 0, 0);
        bottom: 0;
        font-size: 13px;
        padding: 0;

        div {
            display: flex;
            align-items: center;
        }

        .user-name {
            margin: 0 6px
        }

        .up-count {
            margin-left: 2px;
            transform: translateY(2px);
        }
    }

    .van-image {
        opacity: .9;
        border: 1px solid rgba(42, 42, 42, .05);
        border-radius: 50%;
        // img {
        //     opacity: .9;
        //     border: 1px solid rgba(42, 42, 42, .05);
        //     border-radius: 50%;
        // }
    }
}
</style>