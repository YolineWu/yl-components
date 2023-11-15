import {
  ModalEvent,
  ModalState,
  DEFAULT_MODAL_STORE_PATH,
  ModalPageState,
} from "./useModal";
import Vue from "vue";
import { createNamespacedHelpers, Store } from "vuex";
import { BackActionType } from "./useModal";

type IsShowFieldName = `is${string}Show`;
type BackActionFieldName = `${string}backAction`;

type FiledName = IsShowFieldName | BackActionFieldName;

type MapOptionsFlag<Key extends string> = {
  [key in Key]: (
    state: ModalState,
  ) => key extends IsShowFieldName
    ? boolean
    : key extends BackActionFieldName
    ? BackActionType
    : never;
};

type MapOptions = MapOptionsFlag<FiledName>;

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
  // 定义 `yl-modal` 是否正在显示的计算属性
  const { mapState } = createNamespacedHelpers(storePath);
  const isShowFieldName: IsShowFieldName = `is${storePath}Show`;
  const backActionFieldName: BackActionFieldName = `${storePath}backAction`;
  const mapOptions = {
    [isShowFieldName]: (state: ModalState) => state.show,
    [backActionFieldName]: (state: ModalState) => state.data.backAction,
  } as MapOptions;
  const mapStateResult = store.hasModule(storePath)
    ? mapState<ModalState, MapOptions>(mapOptions)
    : ({
        [isShowFieldName]: () => false,
        [backActionFieldName]: () => BackActionType.DISABLED,
      } as MapOptions);

  return Vue.extend({
    computed: mapStateResult,
    onLoad() {
      this.onPageStateChange(ModalPageState.LOAD);
    },
    onShow() {
      this.onPageStateChange(ModalPageState.SHOWED);
    },
    onHide() {
      this.onPageStateChange(ModalPageState.HIDED);
    },
    onUnload() {
      this.onPageStateChange(ModalPageState.UNLOAD);
    },
    onBackPress({ from }): boolean | void {
      if (from === "navigateBack") return;
      switch (this[backActionFieldName as keyof typeof this]) {
        case BackActionType.DISABLED:
          return true;
        case BackActionType.DEFAULT:
          this.$store.dispatch(storePath + "/" + ModalEvent.CLOSE);
          return true;
      }
    },
    methods: {
      onPageStateChange(state: ModalPageState) {
        this.$store.dispatch(
          storePath + "/" + ModalEvent.PAGE_STATE_CHANGE,
          state,
        );
      },
    },
  });
}
