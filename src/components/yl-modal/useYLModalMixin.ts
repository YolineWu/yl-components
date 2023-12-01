import {
  YLModalEvent,
  YLModalState,
  YLModalPageState,
  DEFAULT_YL_MODAL_OPTIONS,
  registerStoreIfNo,
} from "./useYLModal";
import Vue from "vue";
import { Store } from "vuex";
import { BackActionType } from "./useYLModal";
import { StringUtils } from "../../utils/string";

/**
 * `yl-modal` 组件页面行为 `mixin`
 * @param store Vuex store
 */
export function useYLModalMixin(store: Store<any>) {
  if (!storePath) throw Error("storePath 不能为空");
  // 定义 `yl-modal` 是否正在显示的计算属性
  const capitalStorePath = StringUtils.capitalizeFirst(storePath);
  const stateFieldName = `ylModal${capitalStorePath}State`;
  const isShowFieldName = `isYL${capitalStorePath}Show`;
  const backActionFieldName = `yl${capitalStorePath}backAction`;

  return Vue.extend({
    computed: {
      [stateFieldName](): YLModalState | undefined {
        return store.state[storePath];
      },
      [isShowFieldName](): boolean {
        return !!(this[stateFieldName] as YLModalState)?.show;
      },
      [backActionFieldName](): BackActionType {
        return (
          (this[stateFieldName] as YLModalState)?.data.backAction ||
          DEFAULT_YL_MODAL_OPTIONS.backAction
        );
      },
    },
    onLoad() {
      // 如果没有 `yl-modal` 组件的store则注册
      registerStoreIfNo(store, storePath, DEFAULT_YL_MODAL_OPTIONS);

      this.onYlPageStateChange(YLModalPageState.LOAD);
    },
    onShow() {
      this.onYlPageStateChange(YLModalPageState.SHOWED);
    },
    onHide() {
      this.onYlPageStateChange(YLModalPageState.HIDED);
    },
    onUnload() {
      this.onYlPageStateChange(YLModalPageState.UNLOAD);
    },
    onBackPress({ from }): boolean | void {
      if (from === "navigateBack" || !this.ylModalState) return;
      switch (this[backActionFieldName as keyof typeof this]) {
        case BackActionType.DISABLED:
          return true;
        case BackActionType.DEFAULT:
          store.dispatch(storePath + "/" + YLModalEvent.CLOSE);
          return true;
      }
    },
    methods: {
      onYlPageStateChange(state: YLModalPageState) {
        if (this.ylModalState)
          store.dispatch(
            storePath + "/" + YLModalEvent.PAGE_STATE_CHANGE,
            state,
          );
      },
    },
  });
}
