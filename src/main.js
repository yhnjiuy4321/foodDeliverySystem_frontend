import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import header from './components/pagehead.vue';
import menu from "@/components/MenuBar.vue";

const app = createApp(App);
app.use(router);
app.component('pagehead', header);
app.component('menuBar', menu);


createApp(App).use(router).mount('#app')
