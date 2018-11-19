<template>
  <div>
    <label>count is : {{ count }}</label>
    <br>
    <label>count*2 is : {{ doubleCount }}</label>
    <br>
    <button @click="increament">increase</button>
    <button @click="asyncIncreament">increase after 1 second</button>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('demo');

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      count: state => state.count,
    }),
    ...mapGetters(['doubleCount']),
  },
  methods: {
    ...mapMutations(['increament']),
    ...mapActions(['asyncIncreament']),
  },
};
</script>
