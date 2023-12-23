import Vue from "vue";
import App from "./App.vue";
import { YLModalMixin } from "yl-uni-components";
import "./uni.promisify.adaptor";

Vue.config.productionTip = false;

Vue.mixin(YLModalMixin);

new App().$mount();
