<template>
  <div class="role-wrapper">
    <!-- 搜索容器 -->
    <div class="search-container">
      <el-card class="box-card">
        <div class="search-btn-container" style="text-align: right">
          <el-button round size="medium" @click="handleAddItem">新增</el-button>
        </div>
      </el-card>
    </div>
    <!-- 中 数据表格 -->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        :max-height="tableHeight"
      >
        <el-table-column
          prop="username"
          label="用户"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="contentName"
          label="文章"
          align="center"
        ></el-table-column>
        <el-table-column prop="createTime" label="学习时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime.slice(0, 10) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteItem(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatDate, deepClone } from "@/utils/index.js";
import * as apis from "@/api/student.js";
export default {
  data() {
    return {
      tableData: [],
      queryParams: {
        name: "",
      },
      dialogTitle: "新增学生",
      dialogFormVisible: false,
      formLabelWidth: "100px",
      types: [],
      tableHeight: 600,
      formData: {
        categoryName: "",
      },
      rules: {
        categoryName: [
          { required: true, message: "请输入学生", trigger: "change" },
        ],
      },
      roleOptionList: [],
    };
  },
  mounted() {
    window.addEventListener("resize", this.resize);
    this.$nextTick(() => {
      this.resize();
    });
  },
  created() {
    this.handleSearch();
  },
  methods: {
    resize() {
      this.tableHeight = document.documentElement.clientHeight - 240;
    },
    clearHtml(item) {
      return item?.replace(/<[^>]+>/g, ""); // 去掉所有的html标记
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    handleDeleteItem(idx, row) {
      this.$confirm("确定删除此记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          apis
            .delStudent(row.id)
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.query();
            })
            .catch((e) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //初始化对话框，重置对话框
    handleClearForm() {
      this.dialogFormVisible = false;
      this.title = "新增学生";
      this.formData = {
        categoryName: "",
      };
    },
    handleAddItem() {
      this.dialogTitle = "新增学生";
      this.dialogFormVisible = true;
      this.formData = {
        categoryName: "",
      };
    },
    handleEditItem(idx, row) {
      this.dialogFormVisible = true;
      this.dialogTitle = "编辑学生";
      this.formData = deepClone(row);
    },
    query() {
      apis
        .getStudentList(this.queryParams)
        .then((res) => {
          console.log("res", res);
          this.tableData = res.data;
        })
        .catch((e) => {});
    },
    handleSearch() {
      this.query();
    },

    //当页大小发生变化
    handleSizeChange(size) {
      this.query();
    },
    //当前页码发生变化
    handleCurrentChange(num) {
      this.query();
    },
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
