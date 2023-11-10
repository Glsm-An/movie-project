<template>
    <div class="recommend-cell">
        <van-cell value-class="title" :value="title" />
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "标题",
        },
    },
}
</script>

<style lang="scss">
.recommend-cell {
    position: relative;

    .title {
        font-size: 18px;
        font-weight: normal;
    }

    &::before {
        position: absolute;
        top: 12px;
        left: 0;
        display: block;
        width: 2px;
        height: 20px;
        background-color: var(--red);
        content: "";
        z-index: 10;
    }
}
</style>