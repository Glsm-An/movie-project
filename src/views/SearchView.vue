<template>
    <div class="home">
        <form action="/">
            <van-search v-model.trim="search" show-action placeholder="搜电影、搜影院" @search="onInput(search, cityid)"
                @cancel="onCancel" @focus="focusHandle" />
        </form>

        <div class="history" v-show="!showSearchResult">
            <van-cell v-for="s in searchHistoryList" :key="s" :title="s" icon="clock-o" @click="getSearch(s, cityid)">
                <template #right-icon>
                    <van-icon class="delete-history" @click="removeHistory(s)" name="cross" />
                </template>
            </van-cell>
        </div>

        <!-- 搜索数据展示区 -->
        <!-- {{ searchAllMatch }} -->
        <div class="result-wrapper" v-show="showSearchResult">
            <!-- 电影/电视剧等 -->
            <div class="result" v-show="searchAllMatch">
                <h3 v-show="searchAllMatch.list">电影/电视剧/综艺</h3>
                <div class="list">
                    <router-link tag="div" class="movie cell" v-for="s in searchAllMatch.list" :key="s.id"
                        :to="{ name: 'moviedetails', query: { id: s.id } }">
                        <img :src="s.img" class="poster">
                        <div class="info">
                            <div class="name-score">
                                <p class="name">
                                    <span class="one-line">{{ s.nm }}</span>
                                    <span class="version v2d imax" v-show="s.version != ''"></span>
                                </p>
                                <span class="score" v-show="s.sc">
                                    <span class="num">{{ s.sc }}</span>分
                                </span>
                            </div>
                            <div class="detail-section">
                                <div class="detail-items">
                                    <P class="ename one-line">{{ s.enm }}</P>
                                    <P class="catogary">{{ s.cat }}</P>
                                    <P class="release">{{ s.rt }}</P>
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <div class="total" v-show="searchAllMatch.total">查看全部 {{ searchAllMatch.total }} 部影视剧</div>
                </div>
            </div>
            <!-- 影院搜索数据 -->
            <div class="result" v-show="searchCinemas">
                <h3 v-show="searchCinemas.list">影院</h3>
                <div class="list">
                    <div class="cinema cell" v-for="c in searchCinemas.list" :key="c.id">
                        <div class="info">
                            <p class="name-price">
                                <span class="name one-line">{{ c.nm }}</span>
                                <span class="sell-price"><span class="price">{{ c.sellPrice }}</span>元起</span>
                            </p>
                            <p class="address">{{ c.addr }}</p>
                        </div>
                    </div>
                </div>
                <div class="total" v-show="searchCinemas.total">查看全部 {{ searchCinemas.total }} 家电影院</div>
            </div>
        </div>
    </div>
</template>

<script>
// import { Toast } from 'vant';
import { getSearch } from "../apis/search";
import _ from 'lodash'
import { mapState } from 'vuex';
export default {
    data() {
        return {
            search: '',
            cityid: '',
            // 搜索结果展示属性
            showSearchResult: false,
            searchAllMatch: [],
            searchCinemas: [],
            searchHistoryList: [],
            keyword: '',
        };
    },
    mounted() {
        this.debounceSearch = _.debounce(this.getSearch, 800, {
            leading: true,
            trailing: true,
        });
        this.getCityId();
        this.getHistorySearch();
    },
    methods: {
        getCityId() {
            this.cityid = JSON.parse(localStorage.city).id;
        },
        async getSearch(kw, id) {
            // 开始搜索前清空上一次的结果
            // this.searchAllMatch = [];
            // this.searchCinemas = [];
            this.search = kw;
            // console.log(123, kw);
            this.showSearchResult = true;
            let { movies, cinemas } = await getSearch(kw, id);
            // console.log(movies);
            this.searchAllMatch = movies || [];
            this.searchCinemas = cinemas || [];
        },
        //开始搜索
        onInput(kw, id) {
            this.search = kw;
            this.keyword = kw;
            this.cityid = id;
            this.showSearchResult = true;
            this.getSearch(this.search, this.cityid)
            // 添加搜索历史记录
            this.setHistorySearch(kw);
        },
        // 相同的搜索记录要去重
        setHistorySearch(kw) {
            // 先把相同的搜索关键字旧的先删除
            this.searchHistoryList = this.searchHistoryList.filter((s) => s != kw);
            // 将搜索关键字存入searchHistoryList最前面
            this.searchHistoryList.unshift(kw);
            // 将数据更新到localstorage中
            localStorage.historySearch = JSON.stringify(this.searchHistoryList);
        },
        // 删除一条历史记录
        removeHistory(kw) {
            // 先把指定搜索关键字先删除
            this.searchHistoryList = this.searchHistoryList.filter((s) => s != kw);
            // 将数据更新到localstorage中
            localStorage.historySearch = JSON.stringify(this.searchHistoryList);
        },
        focusHandle() {
            this.showSearchResult = false;
        },
        // 通过localstorage获取历史搜索记录
        getHistorySearch() {
            let searchHistoryList = localStorage.historySearch || "[]";
            searchHistoryList = JSON.parse(searchHistoryList);
            this.searchHistoryList = searchHistoryList;
        },
        onCancel() {
            this.showSearchResult = false;
            this.search = "";
            this.$router.push({
                name: "hotMovie"
            })
        },
    },
    computed: {
        ...mapState["cityId", "currentCity"]
    },
    watch: {
        async search(kw) {
            if (kw) {
                this.debounceSearch(kw);
            }
        },
        $route() {
            this.getCityId();
        },
        deep: true,
    },
    beforeDestroy() {
        this.getSearch = null;
    }
};
</script>

<style lang="scss">
.home {
    background-color: #f5f5f5;
}

.result-wrapper {
    height: 100%;
    overflow: auto;

    .result {
        margin-bottom: 10px;
        background-color: #fff;

        h3 {
            font-size: 15px;
            color: #999;
            padding: 9px 15px;
            font-weight: 400;
        }

        .list {
            border-bottom: 1px solid #e6e6e6;
            padding-left: 15px;
        }
    }
}

.result .movie {
    padding: 12px 0;
    min-height: 90px;

    .poster {
        background-color: #eee;
        width: 64px;
        height: 90px;
        float: left;
        margin-right: 10px;
        display: block;
        border: 0;
    }

    .info {
        margin-right: 15px;
        margin-top: 1px;
    }
}

.result .cell,
.result .list {
    border-bottom: 1px solid #e6e6e6;
}

.name-score {
    font-size: 16px;
    color: #222;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;

    .name {
        display: flex;
        align-items: center;
        flex-grow: 1;
        max-height: 24px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;


        .one-line {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: 700;
            font-size: 17px;
        }

        .version.v2d.imax {
            width: 43px;
            background-image: url("../assets/v2dimax.png")
        }
    }

    .score {
        color: #fa0;
        font-size: 10px;
        flex-shrink: 0;
        padding-left: 5px;

        .num {
            font-size: 16px;
        }
    }
}

.version {
    background-size: contain;
    background-repeat: no-repeat;
    height: 14px;
    margin-left: 5px;
    display: inline-block;
}

.detail-section {
    position: relative;
}

.detail-items {
    overflow: hidden;
    padding-right: 10px;
    margin-right: 48px;
    min-height: 27px;

    p {
        padding: 3px 0;
    }

    .one-line {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .ename {
        font-size: 13px;
        color: #666;
        margin-top: 2px;
    }

    .catogary,
    .release {
        font-size: 13px;
        color: #666;
        margin-top: 2px;
    }
}

.total {
    font-size: 15px;
    color: #ef4238;
    line-height: 44px;
    height: 44px;
    text-align: center;
}

.score {
    position: static !important;
}

.result .cinema {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 15px 15px 0;

    .info {
        flex: 1;
        overflow: hidden;

        .address {
            font-size: 13px;
            color: #999;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}

.name-price {
    font-size: 16px;
    color: #000;
    margin-bottom: 6px;
    display: flex;

    .one-line {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .sell-price {
        font-size: 11px;
        color: #999;
        white-space: nowrap;
        margin-left: 10px;

        .price {
            font-size: 17px;
            color: #ef4238;
        }
    }
}

.delete-history {
    transform: translateY(6px);
}
</style>