<template>
  <div class="home">
    <h1>创建你的习惯热图</h1>
    <ol>
      <li>下载模板</li>
      <li>填写你的习惯项目，并在对应日期与项目内打钩</li>
      <li>导出为 .csv 格式 （文件-> 导出到 -> csv）</li>
      <li>上传文件，选择修改保存后的csv文件</li>
      <li>生成你的习惯热图</li>
    </ol>
    <!-- <NavBar/> -->
    <HeatMap

    />
  </div>
</template>

<script>
// import NavBar from '@/components/NavBar.vue'
import HeatMap from '@/components/HeatMap.vue'

export default {
  name: 'home',
  components: {
    // NavBar,
    HeatMap
  }
}
</script>
<style lang="scss">
.home{
  height: 100%;
  // display: flex;
}
h1{
  text-align: center;
  margin: 10px;
}
ol{
  width: 300px;
  margin: 0 auto;
  font-size: 12px;
  color: #aaa;
}
</style>
