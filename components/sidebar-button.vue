<script setup lang="ts">
const { href } = defineProps<{
  icon: string;
  label: string;
  href: string;
  iconColor?: string;
  showLabel: boolean;
}>();

const route = useRoute();
const isActive = computed(() => route.path === href);
</script>

<template>
  <div class="tooltip  tooltip-right" :data-tip="showLabel ? undefined : label">
    <nuxt-link
      :to="href"
      :class="{ 'bg-base-200': isActive, '!justify-center': !showLabel }"
      class="flex p-2 gap-2 hover:bg-base-300 hover:cursor-pointer justify-start items-center"
    >
      <Icon
        :name="icon"
        size="24"
        :class="iconColor"
      />
      <transition name="grow">
        <span v-if="showLabel" class="overflow-hidden block text-nowrap">{{ label }}</span>
      </transition>
    </nuxt-link>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 0.3s;
}
.grow-leave-active {
  animation: grow 0.3s reverse;
}
@keyframes grow {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
