<template>
  <div class="c-hh-rating">
    <font-awesome-icon
      v-for="n in count"
      :key="n"
      :class="[
        'c-hh-rating__star',
        { 'c-hh-rating__star--active': n <= current },
      ]"
      @click="() => clickStar(n)"
      :icon="['fas', 'star']"
    />
  </div>
</template>

<script lang="ts" src="./yl-rating.ts" />

<style lang="scss" scoped>
.c-hh-rating {
  display: flex;
  align-items: center;
  column-gap: var(--yl-rating-column-gap);

  &__star {
    width: var(--yl-rating-star-size);
    height: var(--yl-rating-star-size);
    color: var(--yl-rating-star-color);

    &--active {
      color: var(--yl-rating-star-active-color);
    }
  }
}
</style>
