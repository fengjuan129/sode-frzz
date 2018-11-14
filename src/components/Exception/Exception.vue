<template>
  <div class="container">{{ type }} Error</div>
</template>

<script>
export default {
  name: 'Exception',
  props: {
    type: Number,
    default: 500,
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  text-align: center;
  background-color: red;
  font-size: 30px;
}
</style>
