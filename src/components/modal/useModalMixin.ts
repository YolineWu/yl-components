import {
  ModalEvent,
  ModalState,
  DEFAULT_MODAL_STORE_PATH,
  ModalPageState,
  DEFAULT_MODAL_OPTIONS,
} from "./useModal";
import Vue from "vue";
import { Store } from "vuex";
import { BackActionType } from "./useModal";
import { StringUtils } from "../../utils/string";

/**
 * `yl-modal` 组件页面行为 `mixin`，包含 `yl-modal` 组件
 * 的页面都可以使用，决定 `yl-modal` 组件在页面中的一些行为，
 * 具体请查看 {@link ModalMixinOptions}
 * @param store Vuex store
 * @param storePath `yl-modal` 组件对应 Vuex store 的模组路径
 */
export function useModalMixin(
  store: Store<any>,
  storePath: string = DEFAULT_MODAL_STORE_PATH,
) {
  if (!storePath) throw Error("storePath 不能为空");
  // 定义 `yl-modal` 是否正在显示的计算属性
  const capitalStorePath = StringUtils.capitalizeFirst(storePath);
  const isShowFieldName = `isYL${capitalStorePath}Show`;
  const backActionFieldName = `yl${capitalStorePath}backAction`;

  return Vue.extend({
    computed: {
      ylModalState(): ModalState | undefined {
        return store.state[storePath];
      },
      [isShowFieldName](): boolean {
        return !!this.ylModalState?.show;
      },
      [backActionFieldName](): BackActionType {
        return (
          this.ylModalState?.data.backAction || DEFAULT_MODAL_OPTIONS.backAction
        );
      },
    },
    onLoad() {
      this.onYlPageStateChange(ModalPageState.LOAD);
    },
    onShow() {
      this.onYlPageStateChange(ModalPageState.SHOWED);
    },
    onHide() {
      this.onYlPageStateChange(ModalPageState.HIDED);
    },
    onUnload() {
      this.onYlPageStateChange(ModalPageState.UNLOAD);
    },
    onBackPress({ from }): boolean | void {
      if (from === "navigateBack" || !this.ylModalState) return;
      switch (this[backActionFieldName as keyof typeof this]) {
        case BackActionType.DISABLED:
          return true;
        case BackActionType.DEFAULT:
          store.dispatch(storePath + "/" + ModalEvent.CLOSE);
          return true;
      }
    },
    methods: {
      onYlPageStateChange(state: ModalPageState) {
        if (this.ylModalState)
          store.dispatch(storePath + "/" + ModalEvent.PAGE_STATE_CHANGE, state);
      },
    },
  });
}
