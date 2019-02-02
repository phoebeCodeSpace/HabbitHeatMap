<template>
  <div class="nav-bar">
    <h3>vue heatmap</h3>
    <!-- 主题 -->
    <div class="nav-item">
      <label>theme：</label>
      <div class="radio-groups">
        <label role="radio">
          <input type="radio" value="light" name="theme" :checked="theme==='light'">
          <span class="el-radio-button__inner">light</span>
        </label>
        <label role="radio">
          <input type="radio" value="dark" name="theme" :checked="theme==='dark'">
          <span class="el-radio-button__inner">dark</span>
        </label>
      </div>
    </div>
    <!-- 主题 -->
    <div class="nav-item">
      <label>cell size：</label>
      <input type="number" v-model="cellSize">
    </div>
  </div>
</template>

<script>
export default {
  name: 'nav-bar',
  data () {
    return {
      theme: 'light',
      cellSize: 20
    }
  }

}
</script>

<style scoped lang="scss">
$theme-color : #409EFF;
$input-radius: 3px;
$input-border-color: #dcdfe6;

.nav-bar{
  width: 300px;
  padding: 15px;
  border-right: 1px solid #ddd;
  /* background: rgba(0,0,0,.4); */
  h3{
    margin-bottom: 20px;
  }
}
.nav-item{
  display: flex;
  &+.nav-item{
    margin-top: 10px;
  }
  &>label{
    display: inline-block;
    width: 80px;
    line-height: 32px;
    &+*{
      flex:1;
    }
  }
}

/*
* @component radio
*/
label[role="radio"] {
  &:first-child span{
      border-radius: $input-radius 0 0 $input-radius;
  }
  &:last-child span{
      border-radius: 0 $input-radius $input-radius 0;
  }
  &+label{
    margin-left: -1px;
  }
  input{
    display: none;
    &+span{
      border: 1px solid $input-border-color;
      display: inline-block;
      cursor: pointer;
      padding: 4px 12px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      &:hover{
        color: $theme-color;
      }
    }
    &:checked + span{
      border: 1px solid $theme-color;
      background-color: $theme-color;
      color: #fff;
    }
  }
}

input[type="number"]{
  height: 30px;
  line-height: 30px;
  padding: 5px;
  border-radius: $input-radius;
  border: 1px solid $input-border-color;
}
</style>
