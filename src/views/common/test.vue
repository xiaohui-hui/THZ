<template>
  <div class="test-container">
    <h3>测试</h3>
  </div>
</template>
<script>
  export default {
    components: {

    },
    data () {
      return {
        comId: 1,
        roomId: 1,
        page: 1
      }
    },
    created () {

    },
    mounted () {
      this.getDataList()
    },
    methods: {
      getDataList () {

      }
    }
  }
</script>

<style scoped>

</style>

