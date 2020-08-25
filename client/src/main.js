import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vueCustomElement from 'vue-custom-element';
import App from './App.vue';
import router from './router';
import 'document-register-element/build/document-register-element';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(vueCustomElement);

App.router = router;
Vue.customElement('vit2-chat', App);
