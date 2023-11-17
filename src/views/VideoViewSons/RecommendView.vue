<template>
    <div class="video-list">
        <VideoList v-for="r in recommedvideolist" :key="r.id" :id="r.id" :title="r.title" :videoSrc="r.video?.url"
            :userName="r.user.nickName" :userIcon="r.user.avatarurl" :upCount="r.upCount" :commentCount="r.commentCount"
            :bgImg="r.shareInfo.img" :currentPlayingVideo="currentPlayingVideo" @onVideoPlay="onVideoPlay" />
    </div>
</template>

<script>
import VideoList from '@/components/VideoList.vue';
import { getVideo } from "../../apis/video"
export default {
    components: { VideoList },
    data() {
        return {
            recommedvideolist: [],
            currentPlayingVideo: null,
        }
    },
    mounted() {
        this.getVideo();
    },
    methods: {
        async getVideo() {
            let { data } = await getVideo();
            this.recommedvideolist = data.feeds;
            console.log(data.feeds);
        },
        onVideoPlay(playingVideo) {
            if (this.currentPlayingVideo && this.currentPlayingVideo != playingVideo) {
                this.currentPlayingVideo.pause();
            }
            this.currentPlayingVideo = playingVideo;
        },
    }
}
</script>

<style lang="scss">
.video-list {
    margin-bottom: 50px;
}
</style>