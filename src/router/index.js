import { createRouter, createWebHistory } from 'vue-router';
import CustomerTable from '../view/CustomerTable.vue';
import DriverTable from"../view/DriverTable.vue";
import RestaurantTable from "@/view/RestaurantTable.vue";
import OrderTable from "@/view/OrderTable.vue";
import menuTable from "@/view/MenuTable.vue";
import menu from "@/view/Menu.vue";
import loginpage from "@/view/LoginView.vue";
import { authstate } from "@/auth.js";

const routes = [

    {
        path: '/',
        name: 'Home',
        component: loginpage
    },
    {
        path: '/customer',
        name: 'Customer',
        component: CustomerTable,
        meta: { requiresAuth: true }
    },
    {
        path: '/driver',
        name: 'Driver',
        component: DriverTable,
        meta: { requiresAuth: true }
    },
    {
        path: '/restaurant',
        name: 'Restaurant',
        component: RestaurantTable,
        meta: { requiresAuth: true }
    },
    {
        path: '/order',
        name: 'Order',
        component: OrderTable,
        meta: { requiresAuth: true }
    },
    {
        path: '/menu',
        name: 'Menu',
        component: menuTable,
        meta: { requiresAuth: true }
    },
    {
        path: '/restaurant/menu/:id',
        name: 'MenuDetail',
        component: menu,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


//路由守衛，判斷是否登入，若未登入則導向登入頁面
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !authstate.isAuthenticated) {
        next('/');
    } else {
        authstate.isAuthenticated = true;
        next();
    }
});

export default router;

