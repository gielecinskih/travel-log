<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <nuxt-link to="/" class="btn btn-ghost text-xl">
        Travel log
      </nuxt-link>
    </div>
    <div class="navbar-end">
      <app-theme-toggle />
      <auth-button />
    </div>
  </div>
</template>
