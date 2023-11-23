<template>
  <yl-modal class="c-test-yl-modal" ref="ylModal">
    <template v-slot:title="{ title }"
      ><div class="c-test-yl-modal__title">{{ title }}</div></template
    >
    <template v-slot:content="{ content }"
      ><div class="c-test-yl-modal__content">{{ content }}</div></template
    >
    <template v-slot:desc="{ desc }"
      ><div class="c-test-yl-modal__desc">{{ desc }}</div></template
    >
    <template v-slot:cancel="{ cancelText }">
      <button type="primary" plain @click="clickCancel">
        {{ cancelText }}
      </button>
    </template>
    <template v-slot:confirm="{ confirmText }">
      <button type="warn" @click="clickConfrim">{{ confirmText }}</button>
    </template>
  </yl-modal>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import YlModal from "yl-uni-components/components/yl-modal/yl-modal.vue";

@Component({ components: { YlModal } })
export default class TestYlModal extends Vue {
  @Ref() readonly ylModal!: any;

  clickCancel() {
    console.log("---------clickCancel");
    this.ylModal.clickCancel();
  }

  clickConfrim() {
    console.log("---------clickConfirm");
    this.ylModal.clickConfirm();
  }
}
</script>

<style lang="scss" scoped>
.c-test-yl-modal {
  &__title {
    color: darkgreen;
    font-weight: bold;
    text-align: center;
  }

  &__content {
    color: purple;
  }

  &__desc {
    color: skyblue;
  }
}
</style>
