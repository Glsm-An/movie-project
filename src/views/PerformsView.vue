<template>
    <div id="container">
        <!-- 演出 -->
    </div>
</template>

<script>
export default {
    mounted() {
        this.dingwei();
    },
    methods: {
        dingwei() {
            var point = new window.BMapGL.Point(116.331398, 39.897445);
            var map = new window.BMapGL.Map("container");
            map.centerAndZoom(point, 12);

            var geolocation = new window.BMapGL.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == window.BMAP_STATUS_SUCCESS) {
                    var mk = new window.BMapGL.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
                }
                else {
                    alert('错误信息' + this.getStatus());
                }
            });
        },
    }
}
</script>

<style lang="scss">
#container {
    width: 100vw;
    height: 90vh;
}
</style>