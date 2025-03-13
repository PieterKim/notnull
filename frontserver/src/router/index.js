
import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import AdminView from '../views/AdminView.vue'
import ProductView from '../views/ProductView.vue'
import MypageView from '../views/MypageView.vue'
import OrderView from '../views/OrderView.vue'
import productList from '../components/productList/productFilter.vue';
import PostListView from '../views/PostListView.vue'
import testView from '../views/testView.vue'
import modifyUser from '../views/ModifyUserView.vue';





const routes = [
  {
    path: '/',
    name: 'home',
    component: MainView
  },
  {
    path: '/products/:product_id', //products에서 products/:product_id로 변경 (25,1,1 동진)
    name: 'products',
    component: ProductView
  },
  {
    path: '/products/review/:product_id',
    name: 'review',
    component: () => import('../views/post/AddOrModifyPostView.vue')
  }, 
  {
    path: '/createAccount', 
    name: 'createAccount',
        //250103 누리) ',' 추가. chunkname이랑 prefetch 사이에 ',' 있어야 오류 안남
    component: () => import(/* webpackChunkName: "createAccount", webpackPrefetch: true */ '../views/auth/createAccountView.vue')
  },
  {
    path: '/postlist',
    name: 'postlist',
    component: PostListView,
    children: [
      {
        path: ':post_kind', 
        name: 'postlistKind', 
        component: () => import('../components/post/boardlist.vue'),
        props: true, 
      },
      {
        path: '',
        name: 'post_all',
        component: () => import('../components/post/postAll.vue')
      },
      {
        path: 'test',
        name: 'post_test',
        component: () => import('../components/post/postListAll.vue')
      }
    ]
  },
  {
    path: '/etc/:product_kind',
    name: 'etc',
    component: () => import('../components/etc/productsETC.vue'),
    props: true,
  },
  {
    path: '/liqueur',
    name: 'liqueur',
    component: () => import('../components/productList/productAll.vue')
  },
  {
    path: '/liqueur/:drink_type', // 상품리스트 임시용
    name: 'drink_type',
    component: productList,
    props: true
  },

  {
    path: '/post/post_detail/:id',
    name: 'post_detail',
    component: () => import(/* webpackChunkName: "post_detail" */ '../views/post/postDetailView.vue')
  },
  {
    path: '/post/addPost',
    name: 'addPost',
    component: () => import(/* webpackChunkName: "addPost" */ '../views/post/AddOrModifyPostView.vue')
  },
  {
    path: '/post/modifyPost/:id',
    name: 'modifyPost',
    component: () => import(/* webpackChunkName: "modifyPost" */ '../views/post/AddOrModifyPostView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login", webpackPrefetch: true */ '../views/auth/loginView.vue')
  },
  {
    path: '/agree',
    name: 'agree',
    component: () => import(/* webpackChunkName: "agree" */ '../views/auth/agreeView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    children:[
      {
        path:'',
        name:'',
        component: () => import(/* webpackChunkName: "defaultAdminPage" */ '../components/admin/manageUsers.vue')
      },
      {
        path:'users/',
        name:'users',
        component: () => import(/* webpackChunkName: "manageUsers" */ '../components/admin/manageUsers.vue')
      },
      {
        path:'manageOrders/',
        name:'manageOrders',
        component: () => import(/* webpackChunkName: "manageOrders" */ '../components/admin/manageOrders.vue')
      },
      {
        path:'manageProducts/',
        name:'manageProducts',
        component: () => import(/* webpackChunkName: "manageProducts" */ '../components/admin/manageProducts.vue')
      },
      {
        path:'addAccount/',
        name:'addAccount',
        component: () => import(/* webpackChunkName: "addAccount" */ '../components/admin/addAccount.vue')
      },
      {

        path:'modifyProduct/:id',
        component: () => import(/* webpackChunkName: "addOrModifyProduct" */ '../components/admin/addOrModifyProduct.vue')
      },
      {
        path:'addProduct/',
        component: () => import(/* webpackChunkName: "addOrModifyProduct" */ '../components/admin/addOrModifyProduct.vue')
      },
      {
        path:'supplyFactories/',
        component: () => import(/* webpackChunkName: "manageSupplyFactories" */ '../components/admin/manageSupplyFactories.vue')
      },
      {
        path:'productLocations/',
        component: () => import(/* webpackChunkName: "manageProductLocations" */ '../components/admin/manageProductLocations.vue')
      },
      {
        path:'userRatings/',
        component: () => import(/* webpackChunkName: "manageUserRatings" */ '../components/admin/manageUserRatings.vue')
      },
      {
        path:'coupons/',
        component: () => import(/* webpackChunkName: "manageCoupons" */ '../components/admin/manageCoupons.vue')
      },
      {
        path:'cart/',
        component: () => import(/* webpackChunkName: "about" */ '../components/admin/manageProductLocations.vue')
      },
    ]
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MypageView,
  }, // 마이페이지 view 추가
  {
    path:'/modify',
    name:'modify',
    component: modifyUser // 1월7일 유저 정보 수정 페이지 추가 동진
  },

  {
    path: '/orders',
    name: 'orders',
    component: OrderView,
    children:[
      {
        path:'/cart/:userId',
        name:'cart',
        component: () => import(/* webpackChunkName: "orders" */ '../components/orders/userCart.vue')
      },
      {
        path:'/wish/:userId',
        name:'wish',
        component: () => import(/* webpackChunkName: "orders" */ '../components/orders/userWishes.vue')
      },
      {
        path:'/order/:userId',
        name:'order',
        component: () => import(/* webpackChunkName: "orders" */ '../components/orders/orderList.vue')
      },
      {
        path:'/cancelledOrder/:userId',
        name:'cancelledOrder',
        component: () => import(/* webpackChunkName: "orders" */ '../components/orders/cancelledList.vue')
      },
    ]
  },

  {
    path:'/finalOrder/:userId',
    name:'finalOrder',
    component: () => import(/* webpackChunkName: "finalOrder" */ '../views/FinalOrderView.vue')
  },

  {
    path: '/test',
    name: 'test',
    component: testView
  }, // startbootstrap 테스트 위해 1월 5일 동진
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
