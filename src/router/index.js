import Vue from 'vue'
import VueRouter from 'vue-router'
import MovieView from '../views/MovieView.vue'
import VideoView from '../views/VideoView.vue'
import ShortVideoView from '../views/ShortVideoView.vue'
import PerformsView from '../views/PerformsView.vue'
import MyView from '../views/MyView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'movie',
    component: MovieView,
    children: [
      {
        path: 'cinema',
        name: 'cinema',
        component: () => import('../views/MovieViewSons/CinemaView.vue')
      },
      {
        path:'awaitMovie',
        name:'awaitMovie',
        component:() => import('../views/MovieViewSons/AwaitMovieView.vue')
      },
      {
        path:'sutraMovie',
        name:'sutraMovie',
        component:() => import('../views/MovieViewSons/SutraMovieView.vue')
      }
    ]
  },
  {
    path: '/video',
    name: 'video',
    component: VideoView
  },
  {
    path: '/shortvideo',
    name: 'shortvideo',
    component: ShortVideoView
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
