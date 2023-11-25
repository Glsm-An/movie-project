<template>
    <div class="cinema-box" id="abc">
        <go-top />
        <van-dropdown-menu>
            <!-- 地点下拉框 -->
            <van-dropdown-item v-model="value" :title="positionName" ref="dropdown">
                <van-tabs v-model="activeName">
                    <van-tab title="商区" name="a">
                        <van-tree-select :items="district" :main-active-index.sync="activeIndex" :active-id.sync="activeId"
                            @click-item="rightBtn" height="420" @click-nav="left" />
                    </van-tab>

                    <van-tab title="地铁站" name="b">
                        <van-tree-select :items="subway" :main-active-index.sync="lineIndex" :active-id.sync="subwayIndex"
                            @click-nav="subwayLine" @click-item="subwayBtn" height="420" />
                    </van-tab>
                </van-tabs>
            </van-dropdown-item>
            <!-- 品牌下拉框 -->
            <van-dropdown-item :title="brandName" ref="brandDropdown">
                <div v-for="b  in brand" :key="b.id" class="item" :class="{ active: brandIndex == b.id }"
                    @click="brandBtn(b.id, b.name)">
                    <van-icon name="success" color="#dd403b" v-show="brandIndex == b.id" class="icon" />
                    <span class="brand-name">{{ b.name }}</span>
                    <span class="brand-count">{{ b.count }}</span>
                </div>
            </van-dropdown-item>
            <!-- 特色选择框 -->
            <van-dropdown-item :title="typeNames" ref="typeDropdown">
                <div class="close-tab">
                    <div class="tab-page">
                        <!-- 标签选择 -->
                        <div class="special-content">
                            <p class="item-title">特色功能</p>
                            <div class="item-list">
                                <div class="item" v-for="ser in service" :key="ser.id"
                                    :class="{ active: typeActive == ser.id }" @click="typeBtn(ser.id, ser.name)">{{ ser.name
                                    }}</div>
                            </div>
                            <p class="item-title">特殊厅</p>
                            <div class="item-list">
                                <div class="item" v-for="h in hallType" :key="h.id"
                                    :class="{ active: typeRoomActive == h.id }" @click="typeRoomBtn(h.id, h.name)">{{ h.name
                                    }}</div>
                            </div>
                        </div>
                        <!-- 底部按钮 -->
                        <div class="special-btn">
                            <span class="btn" id="cancel-btn" @click="typeReset">重置</span>
                            <span class="btn" id="confirm-btn" @click="typeOk">确定</span>
                        </div>
                    </div>
                </div>
            </van-dropdown-item>
        </van-dropdown-menu>

        <!-- 影院详情 -->
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div class="cinemas-box" v-for="c in cinemaData" :key="c.cinemaId" @click="goCinema(c.cinemaId)">
                <div class="title">
                    <span>{{ c.title }}</span>
                    <span class="price-block">
                        <span class="price">{{ c.price.n }}</span>
                        <span class="q">{{ c.price.q }}</span>
                    </span>
                </div>
                <div class="location-block">
                    {{ c.location }}
                </div>
                <div class="label-block">
                    <van-tag color="#589daf" plain v-for="tag in c.services" :key="tag.code" :class="tag.code">{{
                        tag.text }}</van-tag>
                </div>
                <div class="discount-block" v-if="c.discount.length != 0">
                    <div class="card">
                        <img src="../../assets/card.png">
                    </div>
                    <div class="discount-label-text">{{ c.discount[0].text }}</div>
                </div>
            </div>
            <div class="no-cinema" v-show="filterShow">
                <img src="../../assets/no-cinema.png">
                <p class="no-cinema-tip">暂无符合条件的影院</p>
            </div>
        </van-list>
    </div>
</template>

<script>
import { getCiemas } from '../../apis/cinemas'
import { getCiemasScreen } from '../../apis/cinemasScreen'
import GoTop from '../../components/GoTop.vue'
import goTop from '../../components/GoTop.vue'
export default {
  components: { GoTop },
    comments:{
        goTop
    },
    data() {
        return {
            //数据偏移
            offset: 0,
            cityId: 20,
            activeName: 'a',
            value: 0,
            //地点高亮
            activeId: 0,
            //行政区高亮
            activeIndex: 0,
            //地铁高亮
            lineIndex: 0,
            //地铁站高亮//
            subwayIndex: 0,
            //地点数据
            district: [],
            //地铁线路
            subway: [],
            //品牌数据
            brand: [],
            //影院服务
            service: [],
            //特殊厅
            hallType: [],
            //地点ID
            positionId: -1,
            //地点名称
            positionName: '全城',
            //行政区名称
            adminName: '',
            //地铁线路ID
            lineId: -1,
            //地铁站ID
            subwayId: -1,
            //品牌显示
            brandShow: false,
            //品牌高亮
            brandIndex: -1,
            // 品牌ID
            brandId: -1,
            //品牌名称
            brandName: '品牌',
            //特色功能高亮与ID
            typeActive: -1,
            //特殊厅高亮与ID
            typeRoomActive: -1,
            //特色功能名称
            typeName: '特色',
            //特殊厅名称
            typeRoomName: '',
            //行政区ID,
            administrativeRegion: -1,
            //筛选出的影院数据
            cinemaData: [],
            pushData: [],
            loading: true,
            finished: false,
            refreshing: false,
            filterShow: false,
        };
    },
    mounted() {
        this.getCityId();
        // this.$nextTick(() => {
        this.getCiemas();
        this.getCiemasScreen();
        // })
        window.addEventListener("scroll", this.handleScroll, true)
    },
    methods: {
        getCityId() {
            this.cityId = JSON.parse(localStorage.city).id;
        },
        onConfirm() {
            this.$refs.item.toggle();
        },
        async getCiemas() {
            let { brand, district, hallType, service, subway, timeRanges } = await getCiemas(this.cityId);
            console.log(timeRanges);

            //处理行政区数据
            district.subItems.map(item => {
                let distObj = {
                    text: item.name,
                    children:
                        item.subItems.map(item => {
                            // {
                            //     text:item.name
                            // }
                            let locationObj = {
                                text: item.name,
                                id: item.id,
                                count: item.count
                            }
                            return locationObj
                        }),
                    id: item.id,
                    count: item.count
                }
                this.district.push(distObj)
            });
            //处理地铁线路信息
            subway.subItems.map(item => {
                let distObj = {
                    text: item.name,
                    children:
                        item.subItems.map(item => {
                            // {
                            //     text:item.name
                            // }
                            let locationObj = {
                                text: item.name,
                                id: item.id,
                                count: item.count
                            }
                            return locationObj
                        }),
                    id: item.id,
                    count: item.count
                }
                this.subway.push(distObj)
            });
            //影院品牌信息
            this.brand = brand.subItems;
            //影院服务信息
            this.service = service.subItems;
            //特殊厅信息
            this.hallType = hallType.subItems;
        },
        async getCiemasScreen() {
            let data = await getCiemasScreen(this.offset, this.positionId, this.lineId, this.typeRoomActive, this.brandId, this.typeActive, this.subwayId, this.cityId);
            if (this.refreshing) {
                this.cinemaData = [...data, ...this.cinemaData]
                this.refreshing = false
                this.filterShow = false
            } else {
                this.cinemaData = [...this.cinemaData, ...data]
                this.loading = false
                this.filterShow = false
            }
            if (data.length === 0) {
                this.finished = true
                this.filterShow = false
            }
            if (this.cinemaData.length == 0) {
                this.filterShow = true
                this.finished = false
            }
            // this.cinemaData = data;
            // console.log(data);
        },
        //点击商区左侧
        left(a) {
            if (a == 0) {
                this.activeId = 0;
                this.cinemaData = [];
                this.positionId = -1;
                this.lineId = -1;
                this.subwayId = -1;
                this.positionName = '全城'
                this.cinemaData = [];
                this.getCiemasScreen();
                this.$refs.dropdown.toggle(false);

            }
            this.positionId = this.district[a].id;
            this.administrativeRegion = this.district[a].id;
            this.adminName = this.district[a].text;
            console.log(this.adminName);
            console.log(a);
            this.lineId = -1;
            this.subwayId = -1;
            // this.activeId = 1;

        },

        //点击商区具体位置(右侧)
        rightBtn(b) {
            console.log(b);
            if (b.id == -1) {
                this.cinemaData = [];
                this.positionId = this.administrativeRegion;
                this.positionName = this.adminName;
                console.log("adas", this.adminName);
                this.cinemaData = [];
                this.getCiemasScreen();
                this.$refs.dropdown.toggle(false);
            }
            else {
                this.positionId = b.id;
                this.positionName = b.text;
            }
            this.lineId = -1;
            this.subwayId = -1;
            this.cinemaData = [];
            this.getCiemasScreen();
            this.$refs.dropdown.toggle(false);
        },
        //地铁线路点击事件
        subwayLine(c) {
            //根据下标取ID
            if (c == 0) {
                this.lineId = -1;
                this.positionId = -1;
                this.subwayId = -1;
                this.subwayIndex = 0;
                this.cinemaData = [];
                this.getCiemasScreen();
                this.$refs.dropdown.toggle(false);
            }
            this.positionId = -1;
            this.lineId = this.subway[c].id;
            console.log("地铁线路aaa", this.lineId);
        },
        //地铁站点击事件
        subwayBtn(d) {
            if (d.id == -1) {
                console.log("地铁线路", this.lineId);
                this.positionId = -1;
                this.subwayId = -1;
                this.cinemaData = [];
                this.getCiemasScreen();
                this.$refs.dropdown.toggle(false);
            }
            this.positionId = -1;
            this.subwayId = d.id,
                console.log("subwayid", d.id);
            this.positionName = d.text;
            this.cinemaData = [];
            this.getCiemasScreen();
            this.$refs.dropdown.toggle(false);
        },
        //品牌点击选择方法(改变高亮,改变品牌ID,品牌名等)
        brandBtn(id, name) {
            this.brandIndex = id;
            this.brandName = name;
            this.brandId = id;
            this.cinemaData = [];
            this.getCiemasScreen();
            this.$refs.brandDropdown.toggle(false);

            // console.log(id);
        },
        //特色功能点击事件(改变高亮值,高亮名)
        typeBtn(id, name) {
            this.typeActive = id;
            this.typeName = name;
        },
        //特色放映厅点击事件(改变高亮值,高亮名)
        typeRoomBtn(id, name) {
            this.typeRoomActive = id;
            this.typeRoomName = name;
        },
        //特色功能重置按钮
        typeReset() {
            this.typeActive = -1;
            this.typeRoomActive = -1;
        },
        //特色功能确定按钮
        typeOk() {
            this.cinemaData = [];
            this.getCiemasScreen();
            this.$refs.typeDropdown.toggle(false);
        },
        onLoad() {
            this.offset += 10;
            this.getCiemasScreen();
        },
        goCinema(id){
            this.$router.push({
                // path:'/ciemas',
                name:'ciemas',
                params:{
                    id
                }
            })
        }
    },
    computed: {
        typeNames() {
            if (this.typeActive == -1 && this.typeRoomActive == -1) {
                return '特色';
            }
            if (this.typeActive == -1 && this.typeRoomActive != -1) {
                return this.typeRoomName;
            }
            if (this.typeActive != -1 && this.typeRoomActive == -1) {
                return this.typeName;
            }
            return `${this.typeName},${this.typeRoomName}`;
        }
    }

}
</script>

<style lang="scss" scoped>
.van-dropdown-menu__title {
    font-size: 13px;
    max-width: 92px;
}

.item {
    position: relative;
    line-height: 44px;
    height: 44px;
    padding: 0 15px 0 15px;
    border-bottom: 1px solid #e5e5e5;
    font-size: 15px;

    &.active {
        color: #dd403b;
    }

    .icon {
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
    }

    .brand-name {
        padding-left: 10px;
        display: inline-block;
        width: 48%;
    }

    .brand-count {
        display: inline-block;
        text-align: right;
        width: 48%;
        font-size: 12px;
        padding-right: 12px;
    }

}

// 特色厅
.close-tab {
    position: relative;
    width: 100%;
    background: #fff;
    z-index: 100;
    overflow: scroll;
    color: #777;

    &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0 !important;
    }

    .tab-page {
        min-height: 208px;
        overflow: hidden;
        z-index: 999;
    }
}

.special-content {
    min-height: 150px;
    max-height: 270px;
    overflow: scroll;

    &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0 !important;
    }

    .item-title {
        margin-left: 12px;
        margin-top: 11px;
        font-size: 15px;
    }

    .item-list {
        margin: 0 12px 12px;

        .item {
            float: left;
            width: 21.3%;
            // height: 30px;
            padding: 3px 0;
            margin-right: 3%;
            margin-top: 10px;
            line-height: 38px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 10px;


            &.active {
                background-color: #fcf0f0 !important;
                color: #f03d37;
                border: 1px solid #f03d37 !important;
            }
        }

        &::after {
            display: block;
            clear: both;
            content: "";
        }
    }
}

.special-btn {
    height: 60px;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    margin-top: 10px;
    background: #fafafa;

    .btn {
        display: inline-block;
        height: 34px;
        width: 21.3%;
        margin: 13px 11px;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
    }

    #confirm-btn {
        float: right;
        background: #f03d37;
        border: 1px solid #f03d37;
        color: #fff;
    }
}

.van-list {
    margin-bottom: 52px;
    line-height: 1.5;

    .cinemas-box {
        padding: 13px 15px 13px 0;
        margin-left: 15px;
        border-bottom: 1px solid #ccc;
    }
}

.cinemas-box {
    .title {
        height: 23px;
        line-height: 23px;
        font-size: 16px;
        color: #000;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .price-block {
        padding-top: 9px;
        padding-left: 3px;
        color: #f03d37;

        .price {
            font-size: 18px;
        }

        .q {
            margin-left: 3px;
            font-size: 11px;
        }
    }

    .location-block {
        margin-top: 6px;
        font-size: 13px;
        color: #666;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .label-block {
        height: 17px;
        line-height: 17px;
        margin-top: 4px;
        margin-bottom: 6px;
        overflow: hidden;
        font-size: 0;

        span {
            margin-right: 5px;
            font-size: 10px;
        }

        .vipTag,
        .snack {
            color: #f90 !important;
            border-color: #f90 !important;
        }
    }

    .discount-block {
        color: #999;
        margin-bottom: 4px;
        position: relative;

        .discount-label-text {
            margin-left: 20px;
            font-size: 11px;
        }
    }

    .card {
        width: 15px;
        height: 14px;
        position: absolute;
        left: 0;
        top: 1px;
        // top: 50%;

        img {
            width: 100%;
            display: block;
        }
    }
}

.no-cinema {
    width: 50%;
    padding-top: 20%;
    margin: auto;

    img {
        display: block;
        width: 40%;
        margin: auto;
    }

    .no-cinema-tip {
        text-align: center;
    }
}
</style>