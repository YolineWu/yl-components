<template>
  <view
    v-if="show"
    :class="['c-yl-modal', { 'c-yl-modal--center': center }]"
    @click="clickMask"
  >
    <!-- #ifdef MP -->
    <slot :data="stateData" />
    <view class="c-yl-modal__wrap" v-if="!$slots['default']">
      <slot name="title" :title="title" />
      <view class="c-yl-modal__title" v-if="!$slots['title'] && title">
        {{ title }}
      </view>
      <slot name="content" :content="content" />
      <view class="c-yl-modal__main" v-if="!$slots['content']">
        {{ content }}
      </view>
      <slot name="desc" :desc="desc" />
      <view class="c-yl-modal__desc" v-if="!$slots['desc'] && desc">
        {{ desc }}
      </view>
      <slot
        name="action-bar"
        :cancelText="cancelText"
        :confirmText="confirmText"
      />
      <view class="c-yl-modal__action-bar" v-if="!$slots['action-bar']">
        <view
          class="c-yl-modal__btn-wrap c-yl-modal__btn-wrap--flex-1 c-yl-modal__btn-wrap--cancel"
        >
          <slot name="cancel" :cancelText="cancelText" />
          <button v-if="!$slots['cancel']" @click="clickCancel">
            {{ cancelText }}
          </button>
        </view>
        <view
          class="c-yl-modal__btn-wrap c-yl-modal__btn-wrap--flex-1 c-yl-modal__btn-wrap--confirm"
        >
          <slot name="confirm" :confirmText="confirmText" />
          <button v-if="!$slots['confirm']" @click="clickConfirm">
            {{ confirmText }}
          </button>
        </view>
      </view>
    </view>
    <!-- #endif -->
    <!-- #ifndef MP -->
    <slot :data="stateData">
      <view class="c-yl-modal__wrap">
        <slot name="title" :title="title">
          <view class="c-yl-modal__title" v-if="title">
            {{ title }}
          </view>
        </slot>
        <slot name="content" :content="content">
          <view class="c-yl-modal__main">
            {{ content }}
          </view>
        </slot>
        <slot name="desc" :desc="desc">
          <view class="c-yl-modal__desc" v-if="desc">
            {{ desc }}
          </view>
        </slot>
        <slot
          name="action-bar"
          :cancelText="cancelText"
          :confirmText="confirmText"
        >
          <view class="c-yl-modal__action-bar">
            <view
              class="c-yl-modal__btn-wrap c-yl-modal__btn-wrap--flex-1 c-yl-modal__btn-wrap--cancel"
            >
              <slot name="cancel" :cancelText="cancelText">
                <button @click="clickCancel">
                  {{ cancelText }}
                </button>
              </slot>
            </view>
            <view
              class="c-yl-modal__btn-wrap c-yl-modal__btn-wrap--flex-1 c-yl-modal__btn-wrap--confirm"
            >
              <slot name="confirm" :confirmText="confirmText">
                <button @click="clickConfirm">
                  {{ confirmText }}
                </button>
              </slot>
            </view>
          </view>
        </slot>
      </view>
    </slot>
    <!-- #endif -->
  </view>
</template>
<script lang="ts" src="./yl-modal.ts" />
<style lang="scss" scoped>
@use "src/assets/styles/base/index.scss" as *;

.c-yl-modal {
  position: fixed;
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

  &:not(&--center) > &__wrap {
    margin-top: var(--yl-modal-margin-top);
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
  }

  &__btn-wrap {
    width: 100%;
    height: 100%;

    button {
      @include clear-native-button();
      @include button();
      text-align: center;
      padding: var(--yl-modal-btn-padding);
    }

    &--flex-1 {
      flex: 1;
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
