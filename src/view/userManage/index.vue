<template>
  <div class="info-notice-wrapper">

    <div class="search-container">
      <el-card class="box-card">
        <div style="display: inline-block; vertical-align: top">
          <el-form ref="" :inline="true" class="search-form" model="">
            <el-form-item>
              <el-input v-model="queryInfo.query" style="width:500px;" placeholder="请输入需要查询的学生账号或姓名"
                clearable></el-input>
            </el-form-item>
            <el-form-item>
              <div class="search-btn-container" style="display: inline-block; vertical-align: top">
                <el-button @click="getStuList()" round type="primary" style="margin-top: 2px;" size="medium">查询</el-button>
              </div>
            </el-form-item>

          </el-form>
        </div>
      </el-card>

    </div>

    <div class="table-content">
      <el-table :data="tableData" style="width: 100%" border :max-height="tableHeight">
        <el-table-column prop="uid" label="账号" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="temp" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.temp == "0" ? "禁用" : "正常" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="380px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="resetPwd(scope.row.uid)">重置密码</el-button>
            <el-button size="mini" v-if="scope.row.temp == '1'" type="warning" @click="disable(scope.row.uid)">禁用</el-button>
            <el-button size="mini" v-else type="success" @click="enable(scope.row.uid)">开启</el-button>
            <el-button size="mini" type="danger" @click="deleteTS(scope.row.uid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum" :page-sizes="[1, 2, 5, 100]" :page-size="queryInfo.pageSize"
        layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--抽屉-->
    <!-- <el-drawer
      title="实验记录"
      :visible.sync="dialogFormVisible"
      size="1000px"
      v-loading="drawerLoading"
    >
      <div style="padding: 15px">
        <el-card
          v-for="(item, index) in studentRecordList"
          style="margin: 20px"
        >
          <div v-html="item.content"></div>
          <div v-if="item.auditStatus == 1 || item.auditStatus == 2">
            {{ item.auditStatus == 1 ? "正确" : "错误" }}
          </div>
          <div v-else>
            <el-button
              type="success"
              size="mini"
              @click="handleAudit(item, 1, index)"
              >正确</el-button
            >
            <el-button
              type="error"
              size="mini"
              @click="handleAudit(item, 2, index)"
              >错误</el-button
            >
          </div>
        </el-card>
        <div class="drawer-btn">
          <el-button @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer> -->
  </div>
</template>

<script>
import http from '../../http.js'
export default {
  data() {
    return {
      tableData: [{
        uid: 0,
        temp: 0,
      }],
      queryInfo: {
        query: [],
        pageNum: 1,
        pageSize: 5,
      },
      total: 0,
      tableHeight: 600,
    };
  },
  created() {
    this.getStuList();
  },
  methods: {
    resize() {
      this.tableHeight = document.documentElement.clientHeight - 245;
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    async getStuList() {
      const { data: res } = await http.get("/getStuList", 
      { params: { 
        sid: this.queryInfo.query, 
        pageNum: this.queryInfo.pageNum, 
        pageSize: this.queryInfo.pageSize, 
      } });
      this.tableData = res.data.list;
      this.total = res.data.total;

    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getUserList();
    },
    async deleteTS(id) {
      const{data:res}=await http.delete("/deleteStuList", {params:{sid:id}});
      if(res.code==200)this.$message.success("删除成功");
      else this.$message.error("删除失败");
      location.reload(true);
    },
    async resetPwd(id){
      const{data:res}=await http.get("/resetPwd",{params:{sid:id}});
      if(res.code==200){this.$message.success("密码重置成功");}
      else this.$message.error("删密码重置失败");
    },
    async disable(id){
      const{data:res}=await http.get("/disable",{params:{sid:id}});
      if(res.code==200){this.$message.success("禁用成功");location.reload(true);}
      else this.$message.error("禁用失败");
    },
    async enable(id){
      const{data:res}=await http.get("/enable",{params:{sid:id}});
      if(res.code==200){this.$message.success("启用成功");location.reload(true);}
      else this.$message.error("启用失败");
    }

  },
};
</script>
<style lang="less">
.drawer-btn {
  position: absolute;
  bottom: 10px;
  left: 100px;
}
</style>
