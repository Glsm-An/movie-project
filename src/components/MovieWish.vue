<template>
    <span class="score">{{ wish }}人想看
    </span>
</template>

<script>
 import { getAwaitMovie } from "../apis/movie"
export default {
    props: ['id'],
    data(){
        return {
            wish:'',
        }
    },
    mounted(){
        this.getAwaitMovie();
    },
    computed:{

    },
    methods:{
        //电影未上映没有评分,获取想看人数
        async getAwaitMovie(){
            let{data} = await getAwaitMovie(this.id);
            this.wish = data.movie.wish;
        }
    }

}
</script>

<style lang="scss">
.score {
    // text-align: center;
    position: absolute;
    left: 4px;
    bottom: 2px;
    color: #faaf00;
    font-size: 11px;
    font-weight: 600;
}
</style>