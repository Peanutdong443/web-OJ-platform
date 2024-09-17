<template>
  <div class="login-wrapper">
    <div class="login">
      <el-row :gutter="20">
        <el-col :span="12" style="border-right: 2px solid #dcdfe9">
          <img src="@/assets/login_img1.png" class="imger1" style="width: 500px; height: 400px" alt="" />
        </el-col>
        <el-col :span="12" style="padding-left: 20px">
          <img src="@/assets/logo.jpg" align="middle" style="width:90px;height:90px;">
          <h2 class="title">OJ实验系统-注册</h2>
          <el-form ref="registerFormRef" :rules="registerRules" :model="registerForm" class="register_form"
            label-width="0">
            <el-form-item prop="usertype">
              <el-radio-group v-model="registerForm.usertype">
                <el-radio label="1">教师账号</el-radio>
              <el-radio label="2">学生账号</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 用户账号 -->
            <el-form-item prop="uid">
              <el-input v-model="registerForm.uid" @blur="checkAccount()" placeholder="请输入账号"
                prefix-icon="el-icon-user"></el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"
                prefix-icon="el-icon-lock"></el-input>
            </el-form-item>

            <!-- 按钮 -->
            <el-form-item class="btn">
              <el-button type="primary" round @click="register()" style="width: 100%">注册</el-button>

            </el-form-item>
            <p class="tologin" @click="toLogin()">登录</p>

          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import http from '../http.js'
export default {
  data() {
    return {
      registerForm: {
        uid: null,
        password: "$z12345678",
        usertype: "1",
      },
      registerRules: {
        uid: [
          { required: true, message: '请输入注册账号', trigger: 'blur' },
          { min: 10, max: 10, message: '注册账号长度为10个字符', trigger: 'blur' },
          { pattern: /^\d{1,10}$/, message: '注册账号格式有误!', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入注册密码', trigger: 'blur' },
          { min: 6, max: 15, message: '注册密码长度在 6 ～ 15 个字符', trigger: 'blur' },
          {
            pattern: /^(?:(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[a-z])(?=.*[!@#$%^&*()_+])|(?=.*[A-Z])(?=.*\d)|(?=.*[A-Z])(?=.*[!@#$%^&*()_+])|(?=.*\d)(?=.*[!@#$%^&*()_+]))[A-Za-z\d!@#$%^&*()_+]{8,20}$/
            , message: '注册密码格式有误!', trigger: 'blur'
          }
        ],
      },
      errTime: 1000,
    };
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
    },
    async checkAccount() {
      try {
        const { data: res } = await http.post("checkUserId", this.registerForm.uid);
        if (res.code == 505) {
          this.$message.error("账号已存在！");
        }
      } catch (error) {
        console.error('Error checking account:', error);
      }
    },
    register() {
      // 验证校验规则
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return;
        //访问后台
        const { data: res } = await http.post("register", this.registerForm);

        if (res.code == 200) {
          this.$message.success("注册成功");
          this.$router.push("/login");
        } else {
          this.$message.error("注册失败");
        }
      })
    },
  },
};
</script>
<style>
.login-wrapper .el-form-item {
  margin-bottom: 20px;
}

.login-wrapper .el-form-item__label {
  line-height: 30px;
  padding-bottom: 5px;
}

.imger1:hover {
  transition: all 0.8s;
  transform: scale(1.1);
}
</style>
<style lang="less" scoped>
.login-wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background-color: #ecf2f8;
  background-image: url("@/assets/loginbg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .login {
    width: 1010px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 0 10px #ccc;
    background-color: #ffffff;

    .title {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin: 0 0 30px 0;
    }
  }
}

.register_form {
  position: absolute;
  bottom: 0%;
  width: 45%;
  padding: 0 10;
  box-sizing: border-box;
}

.tologin {
  display: block;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  top: 5px;
  color: #666;
}
</style>
