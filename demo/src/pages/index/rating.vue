<template>
  <div class="p-rating">
    <yl-rating class="p-rating__rating" v-model="current" :count="count" />
    <div class="p-rating__info">
      当前评分：<text class="highlight">{{ current }}</text>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import YlRating from "yl-uni-components/components/yl-rating/yl-rating.vue";

@Component({ components: { YlRating } })
export default class rating extends Vue {
  /** 当前评分 */
  current: number = 2;
  /** 最高评分，即显示多少颗星星 */
  count: number = 5;
}
</script>

<style lang="scss" scoped>
.p-rating {
  display: flex;
  flex-direction: column;
  row-gap: 30rpx;
  padding: 50rpx;

  &__rating {
    align-self: center;
  }

  &__info {
    .highlight {
      font-size: 36rpx;
      font-weight: bold;
    }
  }
}
</style>
