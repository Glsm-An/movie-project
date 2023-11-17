import Vue from 'vue'
import VueRouter from 'vue-router'
import MovieView from '../views/MovieView.vue'
import VideoView from '../views/VideoView.vue'
import ShortVideoView from '../views/ShortVideoView.vue'
import PerformsView from '../views/PerformsView.vue'
import MyView from '../views/MyView.vue'
import HotMovieView from '../views/MovieViewSons/HotMovieView.vue'
import RecommendView from '../views/VideoViewSons/RecommendView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'movie',
    component: MovieView,
    props: true,
    children: [
      {
        path: '',
        name: 'hotMovie',
        props: true,
        // component: () => import('../views/MovieViewSons/HotMovieView.vue')
        component: HotMovieView
      },
      {
        path: 'cinema',
        name: 'cinema',
        component: () => import('../views/MovieViewSons/CinemaView.vue')
      },
      {
        path: 'awaitMovie',
        name: 'awaitMovie',
        component: () => import('../views/MovieViewSons/AwaitMovieView.vue')
      },
      {
        path: 'sutraMovie',
        name: 'sutraMovie',
        component: () => import('../views/MovieViewSons/SutraMovieView.vue')
      }
    ]
  },
  {
    path: '/video',
    name: 'video',
    component: VideoView,
    props: true,
    children: [
      {
        path: '',
        name: 'recommend',
        component: RecommendView
      },
      {
        path: 'hotvideo',
        name: 'hotvideo',
        component: () => import("../views/VideoViewSons/HotVideoView.vue")
      },
      {
        path: 'newvideo',
        name: 'newvideo',
        component: () => import("../views/VideoViewSons/NewVideoView.vue")
      },
      {
        path: 'quickmovie',
        name: 'quickmovie',
        component: () => import("../views/VideoViewSons/QuickMovieView.vue")
      }
    ]
  },
  {
    path: '/shortvideo',
    name: 'shortvideo',
    component: ShortVideoView,
  },
  {
    path: '/performs',
    name: 'performs',
    component: PerformsView
  },
  {
    path: '/my',
    name: 'my',
    component: MyView
  },
  {
    path: 'shortvideoplay',
    name: 'shortvideoplay',
    component: () => import("../components/ShortVideoPlay.vue"),
  },
  {
    path: '/city-list',
    name: 'city-list',
    component: () => import("../views/CityView.vue")
  },
  {
    path: '/moviedetails',
    name: 'moviedetails',
    // props: true,
    props($route) {
      if ($route.query.id != undefined) {
        return {
          id: $route.query.id,
        }
      }
      return;
    },
    component: () => import("../views/MovieDetailsView.vue")
  },
  {
    path:'/search',
    name:'search',
    component:() => import("../views/SearchView.vue")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
