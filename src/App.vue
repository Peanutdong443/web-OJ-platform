<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Home from "@/view/home/index.vue"
export default {
  name: 'App',
  components: {
    Home
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
*,
html,
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "微软雅黑";
}

/* 隐藏滚动条 */
.outer-container::-webkit-scrollbar {
  width: 0;
  /* 设置滚动条的宽度为0 */
  background-color: transparent;
}

/* 自定义滚动条轨道样式 */
.outer-container::-webkit-scrollbar-track {
  background-color: transparent;
  /* 设置滚动条轨道背景为透明 */
}

/* 自定义滚动条滑块样式 */
.outer-container::-webkit-scrollbar-thumb {
  background-color: transparent;
  /* 设置滚动条滑块背景为透明 */
}

</style>
