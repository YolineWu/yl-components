import {
  BackActionType,
  DEFAULT_YL_MODAL_OPTIONS,
  DEFAULT_YL_MODAL_STORE_PATH,
  YLModalEvent,
  YLModalPageState,
  YLModalState,
  registerStoreIfNo,
} from "./useYLModal";
import Vue from "vue";

/**  全局 `YLModalMixin` data类型 */
export type YLModalMixinData = {
  /** 是否正在使用全局 `YLModalMixin` */
  hasYlModalMixin: true;
  /** 当前页面全局弹框名称数组 */
  ylModalNames: string[] | undefined | null;
};

export const YLModalMixin = Vue.extend({
  data(): YLModalMixinData {
    return {
      hasYlModalMixin: true,
      ylModalNames: [DEFAULT_YL_MODAL_STORE_PATH],
    };
  },
  onLoad() {
    // 如果没有 `yl-modal` 组件的store则注册
    this.ylModalNames?.forEach((name: string) => {
      registerStoreIfNo(this.$store, name, DEFAULT_YL_MODAL_OPTIONS);
    });

    this.onYLModalPageStateChange(YLModalPageState.LOAD);
  },
  onShow() {
    this.onYLModalPageStateChange(YLModalPageState.SHOWED);
  },
  onHide() {
    this.onYLModalPageStateChange(YLModalPageState.HIDED);
  },
  onUnload() {
    this.onYLModalPageStateChange(YLModalPageState.UNLOAD);
  },
  onBackPress({ from }): boolean | void {
    if (from === "navigateBack") return;
    this.ylModalNames?.forEach((name: string) => {
      if (!this.$store.hasModule(name)) return;
      switch ((this.$store.state[name] as YLModalState).data.backAction) {
        case BackActionType.DISABLED:
          return true;
        case BackActionType.CLOSEMODAL:
          this.$store.dispatch(name + "/" + YLModalEvent.CLOSE);
          return true;
      }
    });
  },
  methods: {
    onYLModalPageStateChange(state: YLModalPageState) {
      this.ylModalNames?.forEach((name: string) => {
        if (!this.$store.hasModule(name)) return;
        this.$store.dispatch(
          name + "/" + YLModalEvent.PAGE_STATE_CHANGE,
          state,
        );
      });
    },
  },
});
