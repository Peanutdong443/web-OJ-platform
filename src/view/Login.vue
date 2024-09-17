<template>
  <div class="login-wrapper">
    <div class="login">
      <el-row :gutter="20">
        <el-col :span="12" style="border-right: 2px solid #dcdfe9">
          <img src="@/assets/login_img1.png" class="imger1" style="width: 500px; height: 400px" alt="" />
        </el-col>
        <el-col :span="12" style="padding-left: 20px">
          <img src="@/assets/logo.jpg" align="middle" style="width:90px;height:90px;">
          <h2 class="title">OJ实验系统-登陆</h2>
          <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" class="login_form"
            label-width="0">
            <el-form-item prop="usertype">
              <el-radio-group v-model="loginForm.usertype">
                <el-radio label="1">教师账号</el-radio>
              <el-radio label="2">学生账号</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 用户账号 -->
            <el-form-item prop="uid">
              <el-input v-model="loginForm.uid" prefix-icon="el-icon-user" placeholder="请输入账号"></el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"
                placeholder="请输入密码"></el-input>
            </el-form-item>

            <!-- 按钮 -->
            <el-form-item class="btn">
              <el-button type="primary" round @click="login()">登陆</el-button>
              <el-button type="info" round @click="resetLoginForm()">重置</el-button>
            </el-form-item>

            <p class="extrapart">
              <span @click="toRegister()">注册账号</span>
              <span @click="visitLogin()" style="margin-left: 20px; display: inline-block">游客登录</span>
            </p>

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
      // 表单数据对象
      loginForm: {
        uid: "2021150131",
        password: "$z12345678",
        usertype: "1",
      },
      // 校验对象
      loginRules: {
        uid: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 10, max: 10, message: '账号长度为10个字符', trigger: 'blur' },
          { pattern: /^\d{1,10}$/, message: '账号格式有误!', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 ～ 15 个字符', trigger: 'blur' },
          {
            pattern: /^(?:(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[a-z])(?=.*[!@#$%^&*()_+])|(?=.*[A-Z])(?=.*\d)|(?=.*[A-Z])(?=.*[!@#$%^&*()_+])|(?=.*\d)(?=.*[!@#$%^&*()_+]))[A-Za-z\d!@#$%^&*()_+]{8,20}$/
            , message: '密码格式有误!', trigger: 'blur'
          }
        ],
      },
      errTime: 1000,
    };
  },
  methods: {
    toRegister() {
      this.$router.push("/Register");
    },
    //游客登陆
    visitLogin() {
      localStorage.clear();
      this.$router.push("/examManage");
    },

    //重置表单内容
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },

    //用户登录
    login() {
      localStorage.clear();
      // 验证校验规则
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        // 访问后台
        const { data: res } = await http.post("login", this.loginForm);

        if (res.code == 200) {
          this.$message.success("登陆成功");

          console.log(JSON.stringify(res.data.avatarUrl));

          localStorage.setItem("token", JSON.stringify(res.data.token));
          localStorage.setItem("usertype", this.loginForm.usertype);
          const ptr = JSON.stringify(res.data.avatarUrl);
          let url=ptr.replaceAll("\"","");

          localStorage.setItem("avatarUrl", url);

          this.$router.push("/examManage");

        } else if (res.code == 501) {
          this.$message.error("用户不存在！");
        } else if (res.code == 503) {
          this.$message.error("密码错误！");
        } else if (res.code == 506) {
          this.$message.error("账号类型错误！");
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

.imger1:hover {
  transition: all 0.8s;
  transform: scale(1.1);
}

.login-wrapper .el-form-item__label {
  line-height: 30px;
  padding-bottom: 5px;
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
  background-image: url("@/assets/bg.gif");
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

.btn {
  display: flex;
  justify-content: center;
  text-align: center;
}

.login_form {
  position: absolute;
  bottom: 0%;
  width: 45%;
  padding: 0 10;
  box-sizing: border-box;
}

.extrapart {
  display: block;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  top: 5px;
  color: #666;
}
</style>
