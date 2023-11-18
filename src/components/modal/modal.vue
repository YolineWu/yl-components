<template>
  <div
    v-if="show"
    :class="['c-yl-modal', { 'c-yl-modal--center': center }]"
    @click="clickMask"
  >
    <slot v-bind="stateData"></slot>
    <div v-if="!$slots['default']" class="c-yl-modal__wrap">
      <slot name="title" v-bind="{ title }"></slot>
      <div class="c-yl-modal__title" v-if="!$slots['title'] && title">
        {{ title }}
      </div>
      <slot name="content"></slot>
      <div class="c-yl-modal__main" v-if="!$slots['content']">
        {{ content }}
      </div>
      <slot name="desc"></slot>
      <div class="c-yl-modal__desc" v-if="!$slots['desc'] && desc">
        {{ desc }}
      </div>
      <slot name="action-bar"></slot>
      <div class="c-yl-modal__action-bar" v-if="!$slots['action-bar']">
        <div class="c-yl-modal__btn-wrap c-yl-modal__btn-wrap--cancel">
          <slot name="cancel"></slot>
          <button v-if="!$slots['cancel']" @click="clickCancel">
            {{ cancelText }}
          </button>
        </div>
        <div class="c-yl-modal__btn-wrap c-yl-modal__btn-wrap--confirm">
          <slot name="confirm"></slot>
          <button v-if="!$slots['confirm']" @click="clickConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
</script>

<style lang="scss" scoped>
.c-yl-modal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--yl-modal-z-index);
  background: var(--yl-modal-mask-bg);
  display: flex;
  flex-direction: column;
  align-items: center;

  &--center {
    justify-content: center;
  }

  &:not(&--center) {
    & > div {
      margin-top: var(--yl-modal-margin-top);
    }
  }

  &__wrap {
    padding: var(--yl-modal-padding);
    background: var(--yl-modal-bg);
    width: var(--yl-modal-width);
    border-radius: var(--yl-modal-border-radius);
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: var(--yl-modal-title-size);
    font-weight: bold;
    text-align: center;
  }

  &__main {
    margin-top: var(--yl-modal-space-title-main);
  }

  &__desc {
    margin-top: var(--yl-modal-space-main-desc);
    color: var(--yl-modal-desc-color);
  }

  &__action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: var(--yl-modal-action-bar-gap);
    padding: var(--yl-modal-action-bar-padding);
    margin-top: var(--yl-modal-space-desc-action-bar);

    & > * {
      flex: 1;
    }
  }

  &__btn-wrap {
    button {
      @include clear-native-button();
      @include button();
      text-align: center;
      padding: var(--yl-modal-btn-padding);
      width: 100%;
      height: 100%;
    }

    &--cancel {
      button {
        background: var(--yl-modal-cancel-bg-color);
        color: var(--yl-modal-cancel-text-color);
        border: var(--yl-modal-cancel-border);
      }
    }

    &--confirm {
      button {
        background: var(--yl-modal-confirm-bg-color);
        color: var(--yl-modal-confirm-text-color);
        border: var(--yl-modal-confirm-border);
      }
    }
  }
}
</style>
