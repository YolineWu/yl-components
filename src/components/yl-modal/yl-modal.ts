import Vue from "vue";
import {
  DEFAULT_MODAL_OPTIONS,
  ModalData,
  ModalEvent,
  ModalState,
  DEFAULT_MODAL_STORE_PATH,
} from "./useModal";

export default Vue.extend({
  name: "yl-modal",
  props: {
    storePath: { type: String, default: DEFAULT_MODAL_STORE_PATH },
    center: { type: Boolean, default: true },
  },
  computed: {
    state(): ModalState | undefined {
      return this.$store.state[this.storePath];
    },
    stateData(): ModalData {
      return this.state?.data || DEFAULT_MODAL_OPTIONS;
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
    emitEvent(event: ModalEvent) {
      this.$store.dispatch(this.storePath + "/" + event);
      this.$emit(event);
    },
    /** 点击取消时调用 */
    clickCancel() {
      this.emitEvent(ModalEvent.CANCEL);
    },
    /** 点击确认时调用 */
    clickConfirm() {
      this.emitEvent(ModalEvent.CONFIRM);
    },
    /** 点击模态框外的区域时调用 */
    clickMask() {
      this.emitEvent(ModalEvent.CLICK_MASK);
    },
  },
});
