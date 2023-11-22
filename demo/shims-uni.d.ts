/// <reference types='@dcloudio/types' />
import Vue from "vue";
import { Store } from "vuex";
declare module "vue/types/options" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentOptions<V extends Vue> extends Hooks {
    /**
     * 组件类型
     */
    mpType?: string;
    store?: Store;
  }
}
