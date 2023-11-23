import Vue from 'vue'
import VueRouter from 'vue-router'
import MovieView from '../views/MovieView.vue'
import VideoView from '../views/VideoView.vue'
import ShortVideoView from '../views/ShortVideoView.vue'
import PerformsView from '../views/PerformsView.vue'
import MyView from '../views/MyView.vue'
import HotMovieView from '../views/MovieViewSons/HotMovieView.vue'
import RecommendView from '../views/VideoViewSons/RecommendView.vue'
import AuthorizationView from '../views/AuthorizationView.vue'
import LoginView from '../views/Authorization/LoginView.vue'

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
    path: '/search',
    name: 'search',
    component: () => import("../views/SearchView.vue")
  },
  {
    path: '/ciemas/:id',
    name: 'ciemas',
    props: true,
    component: () => import("../views/CiemasView.vue")
  },
  {
    path: '/ticketing',
    name: 'ticketing',
    props: true,
    component: () => import("../views/TickeTingView.vue")
  },
  {
    path: '/authorization',
    name: 'authorization',
    component: AuthorizationView,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView
      },
      {
        path: 'register',
        name: 'register',
        component: () => import("../views/Authorization/RegisterView.vue")
      }
    ]
  },
  // {
  //   path:'/',
  //   redirect: '/movie'
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const { name } = to
  if (name == 'my') {
    // 根据token是否存在做登录验证
    let token = localStorage.token;

    if (!token) {
      //未登录
      next({ name: 'login', params: to })

    } else {
      next()
    }
  } else {
    next()
  }
})


//解决路由守卫抛出异常问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
export default router
