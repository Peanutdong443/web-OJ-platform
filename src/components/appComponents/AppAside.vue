<template>
  <el-row class="menu-wrapper">
    <el-col :span="24">
      <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80px;
        ">
        <img src="@/assets/logo.jpg" alt="" style="width: 40px;">
        &nbsp;&nbsp;
        <span style="font-size: 16px; font-weight: bold;color:rgb(125,11,65);font-size: 20px">OJ实验系统 </span>
      </div>
      <div style="height: calc(100vh - 80px); overflow-y: auto">
        <el-menu :router="true" ref="menu" text-color="rgb(125,11,65)" active-text-color="white" default-active="/examManage"
        :unique-opened="true">
          <el-menu-item  index="/examManage" @click="navigateTo('/examManage')">
            &nbsp;&nbsp;
            <i  class="iconfont icon-kaoshi3" ></i>
            <span>&nbsp;&nbsp;实验列表</span>
          </el-menu-item>

          <template v-if="this.userType == 0"></template>
          <template v-if="this.userType == 2">
            <el-menu-item index="/submitManage" @click="navigateTo('/submitManage')">
              &nbsp;&nbsp;
              <i class="iconfont icon-xueyuan-kaoshi"></i>
              <span>&nbsp;&nbsp;提交列表</span>
            </el-menu-item>

            <el-menu-item index="/personCenter" @click="navigateTo('/personCenter')">
              &nbsp;&nbsp;
              <i class="iconfont icon-gerenxinxi"></i>
              <span>&nbsp;&nbsp;个人中心</span>
            </el-menu-item>
          </template>

          <template v-if="this.userType == 1">

            <el-menu-item index="/explRelease" @click="navigateTo('/explRelease')">
              &nbsp;
              <i class="el-icon-s-data"></i>
              <span>&nbsp;实验发布</span>
            </el-menu-item>

            <el-menu-item index="/userManage" @click="navigateTo('/userManage')">
              &nbsp;
              <i class="el-icon-document"></i>
              <span>&nbsp;学生管理</span>
            </el-menu-item>

            <el-menu-item index="/personCenter" @click="navigateTo('/personCenter')">
              &nbsp;&nbsp;
              <i class="iconfont icon-gerenxinxi"></i>
              <span>&nbsp;&nbsp;个人中心</span>
            </el-menu-item>

          </template>

        </el-menu>
      </div>
    </el-col>
  </el-row>
</template>
<script>

export default {
  name: "AppAside",
  data() {
    return {
      userType: null,
    };
  },
  created(){
    if(localStorage.getItem("usertype")!=null)this.userType=localStorage.getItem("usertype");
    this.$router.push("/examManage");
  },
  methods:{
    navigateTo(path) {
      this.$router.push(path);
    }
  }
  
};
</script>
<style lang="less">
.menu-wrapper {
  background-color: #fff;


  .el-menu-item {
    border-radius: 0 20px 20px 0;
    width: 85%;
    font-size: 16px;


    &:hover {
      border-radius: 0 20px 20px 0;
      background-color: rgb(207, 142, 173)!important;
      color: #fff !important;

      //less语法，实现鼠标悬停时icon变色
      i {
        color: #fff;
      }
    }
  }


  .el-menu {
    border: none;
  }

  /* 设置激活菜单项的背景颜色 */
  .el-menu-item.is-active {
    background-color: rgb(125,11,65); /* 你想要的颜色 */
  }
  i{
    color: rgb(125,11,65);
    .is-active{
      color:white;
    }
  }

}
</style>
