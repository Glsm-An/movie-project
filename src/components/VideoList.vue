<template>
    <div class="video-item">

        <div class="videoplayer">
            <video @loadedmetadata="getTimes" ref="video" :controls="play" :poster="bgImg" :src="videoSrc" @play="onplay"
                @pause="play = false"></video>
            <div class="play-btn" v-show="!play" @click="videoPlay"></div>
            <div class="title">{{ title }}</div>
            <div class="info-bar">
                <div class="time">
                    {{ totalTime }}
                </div>
            </div>
        </div>

        <div class="video-info">
            <div class="left">
                <van-image round width="23px" height="23px" :src="userIcon" />
                <div class="user-name">{{ userName }}</div>
            </div>
            <div class="right">
                <div class="video-praise">
                    <van-icon name="good-job-o" size="22" />
                    {{ upCount }}
                </div>
                <div class="video-comment">
                    <van-icon name="more-o" size="22" />
                    {{ commentCount }}
                </div>

                    <van-icon name="share-o" size="22" @click="showShare = true"/>
                    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
        

            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
export default {
    data() {
        return {
            play: false,
            showShare: false,
            totalTime: "00:00",
            options: [
                { name: '微信', icon: 'wechat' },
                { name: '微博', icon: 'weibo' },
                { name: '复制链接', icon: 'link' },
                { name: '分享海报', icon: 'poster' },
                { name: '二维码', icon: 'qrcode' },
            ],
        }
    },
    props: ["id", "title", "videoSrc", "userName", "userIcon", "upCount", "commentCount", "bgImg", "currentPlayingVideo"],
    mounted() {

    },
    methods: {

        onplay() {
            //把正在播放的video标签方向传值
            this.$emit('onVideoPlay', this.$refs.video);
            this.play = true
        },
        videoPlay() {
            const video = this.$refs.video;
            if (video.pause) {
                video.play()
            } else {
                video.pause()
            }
        },
        getTimes() {
            let video = this.$refs.video;
            let time = video.duration;
            let m = Math.floor(time / 60);
            let s = Math.floor(time % 60);
            m = m < 10 ? `0${m}` : m;
            s = s < 10 ? "0" + s : s;
            let timeStr = m + ":" + s;
            // console.log(timeStr);
            this.totalTime = timeStr;
            // console.log(this.totalTime);
            // return timeStr
        },
        onSelect(option) {
            Toast(option.name);
            this.showShare = false;
        },
    },
    computed: {

    },
}
</script>

<style lang="scss">
.video-item {
    margin-bottom: 5px;
    position: relative;

    .videoplayer {
        position: relative;
        height: 218px;
        overflow: hidden;
        background-color: #000;

        video {
            width: 100%;
            height: 100%;
            background-color: #000;
            object-fit: cover;
        }

        .play-btn {
            // z-index: 10;
            position: absolute;
            left: 50%;
            top: 50%;
            width: 60px;
            height: 60px;
            transform: translateX(-50%) translateY(-50%);
            background-image: url(../assets/video-play.png);
            background-size: contain;
        }

        .title {
            position: absolute;
            top: 0;
            left: 0;
            font-family: PingFangSC-Medium, serif;
            font-size: 16px;
            color: #fff;
            letter-spacing: 0;
            line-height: 100%;
            z-index: 1;
            margin: 9.2px 15.4px 19.5px;
            // display: -webkit-box;

            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
        }


    }
}

.info-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 30px;
    line-height: 30px;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, .5));
    color: #fff;
    font-size: 12px;

    .time {
        float: right;
        margin-right: 10px;
    }
}

.video-info {
    height: 48px;
    background-color: #fff;
    padding-left: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
        height: 100%;
        display: flex;
        align-items: center;

        .user-name {
            margin-left: 9px;
            font-size: 15px;
            color: #666;
        }
    }

    .right {
        height: 100%;
        display: flex;
        align-items: center;
        padding-right: 15px;
        font-size: 14px;

        .video-praise {
            margin-right: 20px;
        }

        .video-comment {
            margin-right: 15px;
        }
    }
}
</style>