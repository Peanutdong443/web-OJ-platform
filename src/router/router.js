import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
var router = new Router({
	routes: [
		{
			path: '/',
			redirect:"/login"
		},
		{
			path: "/home",
			name: 'home',
			component: () => import('@/view/home/index.vue'), // 首页
			redirect: '',
			children: [{
				path: "/userManage",
				name: 'userManage',
				component: () => import('@/view/userManage/index.vue') // 用户管理
			}, {
				path: "/ExplRelease",
				name: 'ExplRelease',
				component: () => import('@/view/ExplRelease/index.vue') // 实验发布
			}, {
				path: "/examManage",
				name: 'examManage',
				component: () => import('@/view/examManage/index.vue') // 实验列表
			}, {
				path: "/submitManage",
				name: 'submitManage',
				component: () => import('@/view/submitManage/index.vue') // 提交记录
			}, {
				path: "/personCenter",
				name: 'personCenter',
				component: () => import('@/view/personCenter/index.vue') // 个人中心
			},
			]


		}, {
			path: "/Login",
			name: 'Login',
			component: () => import('@/view/Login.vue')
		}, {
			path: "/Register",
			name: 'Register',
			component: () => import('@/view/Register.vue')
		},
	]
});
//防止路由重复加载报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
	/**
	 * to 将要访问
	 * from 从哪访问
	 * next 接着干
	 */
	if(to.path=='/login')return next();
	if(to.path=='/Register')return next();
	if(to.path=='/examManage')return next();

	//获取user
	const userFlag = localStorage.getItem('token');
	if(userFlag==null) return next('/login');
	else return next();//符合要求 放行
  })
  
export default router;