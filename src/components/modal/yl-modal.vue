<template>
  <div
    v-if="show"
    :class="['c-yl-modal', { 'c-yl-modal--center': center }]"
    @click="clickMask"
  >
    <slot :data="stateData" />
    <div v-if="!$slots['default']" class="c-yl-modal__wrap">
      <slot name="title" :title="title" />
      <div class="c-yl-modal__title" v-if="!$slots['title'] && title">
        {{ title }}
      </div>
      <slot name="content" :content="content" />
      <div class="c-yl-modal__main" v-if="!$slots['content']">
        {{ content }}
      </div>
      <slot name="desc" :desc="desc" />
      <div class="c-yl-modal__desc" v-if="!$slots['desc'] && desc">
        {{ desc }}
      </div>
      <slot
        name="action-bar"
        :clickCancel="clickCancel"
        :clickConfirm="clickConfirm"
      />
      <div class="c-yl-modal__action-bar" v-if="!$slots['action-bar']">
        <div class="c-yl-modal__btn-wrap c-yl-modal__btn-wrap--cancel">
          <slot name="cancel" :clickCancel="clickCancel" />
          <button v-if="!$slots['cancel']" @click="clickCancel">
            {{ cancelText }}
          </button>
        </div>
        <div class="c-yl-modal__btn-wrap c-yl-modal__btn-wrap--confirm">
          <slot name="confirm" :clickConfirm="clickConfirm" />
          <button v-if="!$slots['confirm']" @click="clickConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./yl-modal.ts" />
<style lang="scss" src="./yl-modal.scss" scoped />
