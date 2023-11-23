<template>
    <div class="back-top" @click="backTop" v-show="goTop">
        <img src="gotop.png" alt="">
        <p>返回顶部</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            goTop: false,
        }
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true)
    },
    methods: {
        handleScroll() {
            let top = document.documentElement.scrollTop || document.body.scrollTop;
            top > 400 ? (this.goTop = true) : (this.goTop = false)
        },
        //实现滚动效果
        backTop() {
            let top = document.documentElement.scrollTop || document.body.scrollTop;

            const timeTop = setInterval(() => {
                document.body.scrollTop = document.documentElement.scrollTop = top -= 50;
                if (top <= 0) {
                    // this.scrolling = false;
                    clearInterval(timeTop);
                }
                // console.log("top", top);
            }, 10)
        }
    }
}
</script>

<style lang="scss">
.back-top {
    position: fixed;
    right: 10px;
    bottom: 15%;
    z-index: 999;
    width: 40px;
    height: 40px;

    img {
        width: 100%;
        display: block;
    }

    p {
        margin-top: 5px;
        font-size: 10px;
    }
}
</style>