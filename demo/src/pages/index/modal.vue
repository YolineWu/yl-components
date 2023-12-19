<template>
  <div class="p-modal">
    <TestYlModal />
    <button type="prmary" @click="showYlModal">弹出`yl-modal`弹框</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TestYlModal from "@/components/test-yl-modal/test-yl-modal.vue";
import { useYLModal } from "yl-uni-components";
import store from "@/store";

@Component({ components: { TestYlModal } })
export default class modal extends Vue {

  /** 显示模态框 */
  showYlModal() {
    useYLModal(store).show({
      title: "我是标题",
      content: "我是内内内内内内内内内内内内内内内内内内内内内内内内内内内内容",
      desc: "我是描述",
      onConfirm: () => {
        return true;
      },
      onCancel: () => {
        return false;
      },
    });
  }
}
</script>

<style scoped>
.p-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 30rpx;
  padding: 50rpx;
}
</style>
