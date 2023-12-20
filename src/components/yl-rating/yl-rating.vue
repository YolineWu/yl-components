<template>
  <div class="c-hh-rating">
    <div
      v-for="(icon, index) in ratingIcons"
      :key="index"
      :class="[
        'c-hh-rating__star',
        { 'c-hh-rating__star--active': index < current },
      ]"
      @click="() => clickStar(index)"
    >
      <image :src="icon" />
    </div>
  </div>
</template>

<script lang="ts" src="./yl-rating.ts" />

<style lang="scss" scoped>
.c-hh-rating {
  display: flex;
  align-items: center;
  column-gap: var(--yl-rating-column-gap);

  &__star {
    image {
      width: var(--yl-rating-star-size);
      height: var(--yl-rating-star-size);
    }
  }
}
</style>
