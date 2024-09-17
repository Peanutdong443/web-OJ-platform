<template>
  <div class="person-center">
    <el-form ref="form" :model="userInfo" label-width="80px">

      <el-form-item label="昵称">
        <el-input v-model="userInfo.username" style="width: 500px;"></el-input>
      </el-form-item>
      &nbsp;
      <el-form-item label="签名档">
        <el-input type="textarea" v-model="userInfo.sign"></el-input>
      </el-form-item>
      &nbsp;
      <el-form-item label="头像">
        <el-upload class="avatar-uploader" style="text-align: center;" :on-change="handleChange" :auto-upload="false"
          action="null">
          <img src="../../assets/tupian.png" style="width:60%;height:60%;"></img>
        </el-upload>
      </el-form-item>
      &nbsp;&nbsp;

      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="change()">更新</el-button>
        <el-button @click="changepwd()">修改密码</el-button>
        <ChangePassword ref="childDialog"></ChangePassword>
      </el-form-item>


    </el-form>
  </div>
</template>

<script>
import http from '../../http.js'
import { EventBus } from '../../api/EventBus.js';
import ChangePassword from "../../components/appComponents/ChangePassword.vue";
export default {
  data() {
    return {
      headers: {},
      userInfo: {
        username: "",
        sign: "",
      },
      avatar: null,
      avatarFile: null
    };
  },
  components: {
    ChangePassword,
  },
  created() {
    this.loadUserInfo();
    this.headers['Content-Type'] = 'multipart/form-data'

  },
  methods: {

    convertToBase64(file, callback) {
      // 创建FileReader对象
      let reader = new FileReader();
      reader.onload = function (e) {
        // 转换完成，结果将在e.target.result中
        callback(e.target.result);
      };
      reader.readAsDataURL(file);
    },

    handleChange(file, fileList) {
      this.avatarFile = file.raw;
      this.selectedFile = file.raw; // 获取真实的文件对象
      this.convertToBase64(file.raw, (base64) => {
        this.avatar = base64;
      });
    },

    async loadUserInfo() {
      const { data: res } = await http.get("getUserInfo");
      this.userInfo.username = res.data.User.username;
      this.userInfo.sign = res.data.User.sign;
    },


    changepwd() {
      this.$refs.childDialog.openDialog();
    },

    change() {
      this.changeInfo();
      if (this.avatar != null) this.changeAvatar();
    },

    async changeInfo() {

      const { data: res } = await http.post("changeInfo", this.userInfo);
      if (res.code == 200) {
        this.$message.success("个人信息修改成功");
        this.dialogVisible = false;
      } else if (res.code == 401) {
        this.$message.error("登陆过期！请重新登录！");
        this.$router.push("/login");
      }
    },
    async changeAvatar() {
      // 创建FormData对象
      const formData = new FormData();
      formData.append('avatar', this.avatarFile);

      // 使用 Axios 发送请求
      const { data: res } = await http.post('changeAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const ptr = JSON.stringify(res.data.avatarUrl);

      let url = ptr.replaceAll("\"", "");

      localStorage.setItem("avatarUrl", url);
      EventBus.$emit('changeAvatar');
    }
  },
};
</script>
<style lang="less">
.person-center {
  position: absolute;
  top: 20%;
  left: 25%;
}

.drawer-btn {
  position: absolute;
  bottom: 10px;
  left: 100px;
}
</style>
