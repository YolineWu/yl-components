import Vue from "vue";
import {
  DEFAULT_YL_MODAL_OPTIONS,
  YLModalData,
  YLModalEvent,
  YLModalState,
  DEFAULT_YL_MODAL_STORE_PATH,
} from "./useYLModal";

export default Vue.extend({
  name: "yl-modal",
  props: {
    storePath: { type: String, default: DEFAULT_YL_MODAL_STORE_PATH },
    center: { type: Boolean, default: true },
  },
  computed: {
    state(): YLModalState | undefined {
      return this.$store.state[this.storePath];
    },
    stateData(): YLModalData {
      return this.state?.data || DEFAULT_YL_MODAL_OPTIONS;
    },
    show(): boolean {
      return !!this.state?.show;
    },
    title(): string {
      return this.stateData.title;
    },
    content(): string {
      return this.stateData.content;
    },
    desc(): string {
      return this.stateData.desc;
    },
    cancelText(): string {
      return this.stateData.cancelText;
    },
    confirmText(): string {
      return this.stateData.confirmText;
    },
  },
  methods: {
    emitEvent(event: YLModalEvent) {
      this.$store.dispatch(this.storePath + "/" + event);
      this.$emit(event);
    },
    /** 点击取消时调用 */
    clickCancel() {
      this.emitEvent(YLModalEvent.CANCEL);
    },
    /** 点击确认时调用 */
    clickConfirm() {
      this.emitEvent(YLModalEvent.CONFIRM);
    },
    /** 点击模态框外的区域时调用 */
    clickMask() {
      this.emitEvent(YLModalEvent.CLICK_MASK);
    },
  },
});
