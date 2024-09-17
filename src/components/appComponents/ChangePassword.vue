<template>
  <div>
    <el-dialog title="修改密码" width="500px" :visible.sync="dialogVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input placeholder="请输入原密码" v-model="ruleForm.oldPassword" show-password></el-input>
        </el-form-item>
        &nbsp;
        <el-form-item label="新密码" prop="newPassword">
          <el-input placeholder="请输入新密码" v-model="ruleForm.newPassword" show-password></el-input>
        </el-form-item>
        &nbsp;
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input placeholder="请确认新密码" v-model="ruleForm.confirmPassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../http.js'
export default {
  name: "ChangePassword",
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        oldPassword: "$z12345678",
        newPassword: "$z12345679",
        confirmPassword: "$z12345679",
      },
      rules: {
        oldPassword: [
          {required: true,message: '请输入原密码',trigger: "blur",},
        ],
        newPassword: [
          {required: true,message: '请输入新密码',trigger: "blur",},
          { min: 6, max: 15, message: '密码长度在 6 ～ 15 个字符', trigger: 'blur' },
          {pattern: /^(?:(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[a-z])(?=.*[!@#$%^&*()_+])|(?=.*[A-Z])(?=.*\d)|(?=.*[A-Z])(?=.*[!@#$%^&*()_+])|(?=.*\d)(?=.*[!@#$%^&*()_+]))[A-Za-z\d!@#$%^&*()_+]{8,20}$/
            ,message:'密码格式有误!',trigger:'blur'}
        ],
        confirmPassword: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(
                  new Error(
                    '请确认新密码'
                  )
                );
              } else {
                if (value !== this.ruleForm.newPassword) {
                  callback(
                    new Error(
                      '新密码两次输入不同，请重新输入'
                    )
                  );
                }
                callback();
              }
            },
          },
        ],
      },
    };
  },
  methods: {

    openDialog() {
      this.dialogVisible = true;
      if (this.$refs["ruleForm"]) {
        // 清空表单
        this.$refs["ruleForm"].resetFields();
      }
    },

    submitForm() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        const{data:res}= await http.post("changepwd",this.ruleForm);

        if (res.code == 200) {
          this.$message.success("密码修改成功");
          this.dialogVisible=false;

        }else if(res.code==503){
          this.$message.error("原密码错误！");
        }else if(res.code==501||res.code==401){
          this.$message.error("登陆过期！请重新登录！");
          this.$router.push("/login");
        }
       
      });
    },
  },
};
</script>

<style></style>