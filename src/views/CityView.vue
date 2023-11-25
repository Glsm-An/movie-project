<template>
    <div class="city-list">
        <van-index-bar :index-list="indexList">
            <van-index-anchor index="定位">定位城市</van-index-anchor>
            <van-cell class="none-border">
                <div class="location-city ">{{ posationCity }}</div>
            </van-cell>
            <van-index-anchor index="最近">最近访问城市</van-index-anchor>
            <van-cell class="none-border">
                <div class="city-item" v-for="ch in cityHistoryArr" :key="ch.id" @click="onCicyHandle(ch.nm, ch.id)">
                    {{ ch.nm }}
                </div>
            </van-cell>
            <van-index-anchor index="热门">热门城市</van-index-anchor>
            <van-cell class="none-border">
                <div class="city-item" v-for="h in hotCity.hotCity" :key="h.id" @click="onCicyHandle(h.nm, h.id)">
                    {{ h.nm }}
                </div>
            </van-cell>


            <div v-for="(c, i) in cityHandleArr" :key="i">
                <van-index-anchor :index="c.py">{{ c.py }}</van-index-anchor>
                <van-cell v-for="a in c.arr" :key="a.id" :title="a.nm" @click="onCicyHandle(a.nm, a.id)" />
            </div>
        </van-index-bar>
        <!-- {{ indexList }} -->
        <!-- {{ cityHandleArr }} -->
        <div id="container"></div>
        <div id="allmap"></div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    data() {
        return {
            indexList: ["定位", "最近", "热门"],
            index: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
            cityHandleArr: [],
            cityHistoryArr: [],
            id: '',
            citynm: '',
            // hotId: '',
            cityObj: {
                id: '',
                citynm: ''
            },
            posationCity:'',
        }
    },
    // created() {

    // },
    mounted() {
        this.getCityArr();
        //获取最近访问城市列表
        this.getHistoryCity();
        // this.cityHandle();
        this.dingwei();
        this.IPdingwei();
    },
    methods: {
        ...mapMutations(["setCity", "setHotCityArr"]),
        ...mapActions(["getCityArr"]),
        cityHandle() {
            //循环创建一个数组对象,数组有26个对象,分别对应城市首字母
            let abc = [];
            for (let i = 0; i < this.index.length; i++) {
                let obj = {
                    py: this.index[i],
                    arr: []
                }
                abc.push(obj)
            }
            // console.log(this.cityArr);
            //所有城市的首字母跟ABC数组对象的py属性是否相等,如果相等就添加对应的arr中

            this.cityArr.map(item => {
                let one = item.py.substr(0, 1).toUpperCase();
                for (let j = 0; j < abc.length; j++) {
                    if (one === abc[j].py) {
                        abc[j].arr.push(item);
                    }
                    // abc = abc[j].arr.length != 0;
                }
            })
            //删除abc数组中城市列表为空的对象
            abc = abc.filter(item => {
                return item.arr.length != 0;
            })
            // console.log(abc);
            //更新城市索引号
            if (this.indexList.length == 3) {
                abc.map(item => {
                    this.indexList.push(item.py);
                })
            }

            this.cityHandleArr = abc;
            // 处理热门城市数组,变成带有id值的数组对象
            let hotCityArr = [];
            for (let k = 0; k < this.hotCity.length; k++) {
                this.cityArr.filter(item => {
                    if (item.nm == this.hotCity[k]) {
                        let obj = {
                            nm: item.nm,
                            id: item.id
                        }
                        hotCityArr.push(obj)
                    }
                })
            }
            this.setHot(hotCityArr);
        },
        //修改vuex 中的setCity方法
        changeCity(city, cityid) {
            this.setCity({
                currentCity: city,
                cityId: cityid,
            });
        },
        //修改vuex中 setHotCityArr方法
        setHot(a) {
            this.setHotCityArr({
                hotCity: a,
            });
        },
        // 点击城市事件(1.把城市信息存储到localstorage中 2.改变vuex的数据,3.添加最近访问城市,4.路由跳转到首页)
        onCicyHandle(nm, id) {
            this.citynm = nm;
            this.id = id;
            this.cityObj = {
                nm: nm,
                id: id
            }
            // 将数据更新到localstorage中
            localStorage.city = JSON.stringify(this.cityObj);
            // 2.改变vuex的数据
            this.changeCity(nm, id);
            // 3.添加最近访问城市
            this.setHistoryCity(nm, id);
            // 4.路由跳转到首页
            this.$router.replace({
                name: 'hotMovie'
            })
        },
        //最近访问城市
        setHistoryCity(nm, id) {
            let obj = {
                nm,
                id
            }
            // 先把相同的城市旧的先删除
            this.cityHistoryArr = this.cityHistoryArr.filter((s) => s.nm != nm);
            // 将城市名存入cityHistoryArr最前面
            this.cityHistoryArr.unshift(obj);
            //最近访问城市最多只放三个
            if (this.cityHistoryArr.length > 3) {
                // this.cityHistoryArr = this.cityHistoryArr.pop();
                this.cityHistoryArr = this.cityHistoryArr.slice(0, 3);
            }
            // 将数据更新到localstorage中
            localStorage.historyCity = JSON.stringify(this.cityHistoryArr);
        },

        getHistoryCity() {
            // 通过localstorage获取近期访问城市列表
            let cityHistoryArr = localStorage.historyCity || "[]";
            cityHistoryArr = JSON.parse(cityHistoryArr);
            this.cityHistoryArr = cityHistoryArr;
            // 通过localstorage获取城市列表信息
            let cityObj = localStorage.city || "[]";
            cityObj = JSON.parse(cityObj);
            this.cityObj = cityObj;
        },
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
        //使用IP定位(速度更快)
        IPdingwei() {
            let _this = this;
            var map = new window.BMapGL.Map("allmap");
            var point = new window.BMapGL.Point(116.331398, 39.897445);
            map.centerAndZoom(point, 12);

            function myFun(result) {
                var cityName = result.name;
                map.setCenter(cityName);
                console.log("当前定位城市:" + cityName);
                _this.posationCity = cityName
            }
            var myCity = new window.BMapGL.LocalCity();
            myCity.get(myFun);
        }
    },
    computed: {
        ...mapState(["cityArr", "hotCity"]),
    },
    watch: {
        cityArr: function () {
            this.$nextTick(() => {
                this.cityHandle();
                // this.setHotArr();
                console.log(this.hotCity);
            })
        },
        // hotArr:function(){
        //     this.$nextTick(() => {
        //         this.setHotArr();
        //     })
        // }
    }
}
</script>

<style lang="scss" scoped>
.van-cell {
    background-color: #f5f5f5;
    border-bottom: 1px solid #ccc;
}

.none-border {
    border-bottom: none;
}

.van-index-anchor {
    background: #EBEBEB;
}

.city-item,
.location-city {
    float: left;
    background: #fff;
    width: 29%;
    height: 33px;
    margin-right: 4%;
    padding: 0 4px;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    line-height: 33px;
    text-align: center;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 5px;
}

.location-city {
    width: auto;
    min-width: 30%;
    padding: 0 20px;
}

.city-item {
    margin-top: 15px;
}
</style>