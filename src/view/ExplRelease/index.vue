<template>
  <div class="info-notice-wrapper">
    <div class="search-container">
      <el-card class="box-card">
        <div
          class="content-container"
          style="display: inline-block; vertical-align: top"
        >
          <el-form
            ref="form"
            :inline="true"
            class="search-form"
            :model="queryParams"
          >
            <el-form-item label="实验名称">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入实验名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div
          class="search-btn-container"
          style="display: inline-block; vertical-align: top"
        >
          <el-button
            round
            type="primary"
            @click="handleSearch()"
            size="medium"
            style="margin-top: 2px"
            >查询</el-button
          >
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
        v-loading="tableLoading"
        tooltip-effect="light"
      >
        <el-table-column
          prop="name"
          label="名称"
          align="center"
        ></el-table-column>
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="240px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEditItem(scope.$index, scope.row)"
              >编辑</el-button
            >
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
    <!--抽屉-->
    <el-drawer
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :before-close="handleClearForm"
      size="1000px"
      v-loading="drawerLoading"
      :close-on-click-modal="false"
    >
      <div style="padding: 15px">
        <el-form
          :model="formData"
          :rules="rules"
          ref="ruleForm"
          :label-width="formLabelWidth"
          style="height: calc(100vh - 150px); overflow-y: auto"
          v-if="dialogFormVisible"
        >
          <el-form-item label="实验名称">
            <el-input
              v-model="formData.name"
              placeholder="请输入实验名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="实验内容">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="html"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </el-form-item>
          <el-form-item label="实验答案">
            <el-input
              type="textarea"
              v-model="formData.answer"
              placeholder="请输入实验答案"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="drawer-btn">
          <el-button type="primary" @click="handleSubmitItem">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { deepClone } from "@/utils/index";
import * as apis from "@/api/content.js";
export default {
  data() {
    return {
      tableData: [],
      queryParams: {
        name: "",
      },
      tableLoading: false,
      drawerLoading: false,
      dialogTitle: "新增实验",
      dialogFormVisible: false,
      seatVisible: false,
      formLabelWidth: "100px",
      types: [],
      tableHeight: 600,
      currentRoom: null,
      seatDialogVisible: false,
      formData: {
        name: "",
        answer: "",
      },
      seatForm: {
        XCol: "",
        YRow: "",
        seatCode: "",
        seatName: "",
        seatStatus: "",
        roomName: "",
        roomId: "",
      },
      fileList: [],
      videoList: [],
      rules: {},
      seatMap: {},
      indexedDB:
        window.indexedDB ||
        window.webkitindexedDB ||
        window.msIndexedDB ||
        window.mozIndexedDB, //兼容
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: {},
      editorConfig: {
        MENU_CONF: {
          // 配置上传服务器地址
          uploadImage: {
            customUpload(file, insertFn) {
              // 文件上传
              const reader = new FileReader();
              // 读取文件内容
              reader.readAsDataURL(file);
              // 当文件读取完成时的回调函数
              reader.onload = () => {
                // 将文件内容转换为base64格式
                insertFn(reader.result);
              };
            },
          },
          mode: "default", // or 'simple'
        },
      },
      mode: "default", // or 'simple'
    };
  },
  components: {
    Editor,
    Toolbar,
  },
  mounted() {
    this.dbInit().then((res) => {
      this.handleSearch();
    });
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  methods: {
    dbInit() {
      return new Promise((resolve, reject) => {
        //打开数据库，如果没有就新建一个
        //dbname库的名称，2为版本号，切记，版本号不能为小数，会自动四舍五入
        const connection = this.indexedDB.open("dbname2", 2);
        connection.onblocked = function (event) {
          // 如果其他的一些页签加载了该数据库，在我们继续之前需要关闭它们
          alert("请关闭其他由该站点打开的页签！");
        };
        connection.addEventListener("success", (event) => {
          const db = event.target.result;
          db.addEventListener("versionchange", (event) => {
            console.log("The version of this database has changed");
          });
        });
        //成功回调
        connection.onsuccess = function (event) {
          resolve(event.target.result);
        };
        //
        connection.onupgradeneeded = function (event) {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("exam")) {
            //为该数据库创建一个对象仓库，exam,主键为id，下面使用调用的时候主要对应主键
            //autoIncrement 标记会为该仓库开启键生成器。默认该设置是不开启的
            //使用键生成器，当你向对象仓库新增记录时键会自动生成。对象仓库生成的键往往从 1 开始，然后自动生成的新的键会在之前的键的基础上加 1。生成的键的值从来不会减小，除非数据库操作结果被回滚
            db.createObjectStore("exam", { keyPath: "id" });
          }
        };
        //失败回调
        connection.onerror = function (err) {
          reject(err);
        };
      });
    },
    //type 方法类型  data第几条
    async dbOperation(type, data) {
      let typeList = ["add", "get", "getAll", "delete", "put"]; //方法名字
      //如果传的值不在这个列表中
      if (!typeList.includes(type)) {
        throw new Error(`操作类型错误, 仅支持: ${typeList.toString()} 方法`);
      }
      //事务模式有两个选项 readonly 或 readwrite ，默认为 readonly 模式，只读和写入数据
      const readType =
        type === "add" || "delete" || "put" ? "readwrite" : "readonly";
      const res = await this.dbInit();
      const objectStore = res.transaction("exam", readType).objectStore("exam");

      const response = new Promise((resolve, reject) => {
        const request = objectStore[type](data);
        request.onsuccess = (res) => {
          resolve(res.target.result);
        };
        request.onerror = (err) => {
          reject(err);
        };
        request.oncomplete = (event) => {
          alert("All done!");
        };
      });
      return response;
    },

    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    resize() {
      this.tableHeight = document.documentElement.clientHeight - 245;
    },
    handleDeleteItem(idx, row) {
      this.$confirm("确定删除此内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          row.hide = 1;
          this.dbOperation("put", row).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.handleSearch();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async handleSubmitItem() {
      let _data = {
        id: this.formData.id ?? new Date().getTime(),
        name: this.formData.name,
        answer: this.formData.answer,
        content: this.html,
      };
      if (this.formData.id) {
        const res = await this.dbOperation("put", _data);
        this.$message.success("修改成功");
      } else {
        const res = await this.dbOperation("add", _data);
        this.$message.success("创建成功");
      }
      this.dialogFormVisible = false;
      this.handleSearch();
    },
    handleClearParams() {
      this.queryParams = {
        name: "",
      };
    },
    //初始化对话框，重置对话框
    handleClearForm() {
      this.dialogFormVisible = false;
      this.drawerLoading = false;
    },
    handleAddItem() {
      this.dialogTitle = "新增实验";
      this.formData = {
        name: "",
        answer: "",
      };
      this.dialogFormVisible = true;
    },
    handleSeat(id, row) {
      this.currentRoom = row;
      this.seatVisible = true;
      apis.getSeatList({ roomId: row.roomId }).then((res) => {
        console.log("res", res);
        res.forEach((item) => {
          this.$set(this.seatMap, `${item.YRow}_${item.XCol}`, item);
        });
      });
    },
    handleSubmiSeat() {
      apis.addSeat(this.seatForm).then((res) => {
        this.seatDialogVisible = false;
        apis.getSeatList({ roomId: this.currentRoom.roomId }).then((res) => {
          res.forEach((item) => {
            this.$set(this.seatMap, `${item.YRow}_${item.XCol}`, item);
          });
        });
      });
    },
    handleEditItem(idx, row) {
      this.dialogTitle = "编辑实验";
      this.formData = deepClone(row);
      this.html = row.content;
      this.dialogFormVisible = true;
    },
    handleSearch() {
      this.dbOperation("getAll").then((res) => {
        if (this.queryParams.name) {
          this.tableData = (res ?? []).filter((item) => {
            return !item.hide && item.name.includes(this.queryParams.name);
          });
        } else {
          this.tableData = (res ?? []).filter((item) => {
            return !item.hide;
          });
        }
      });
    },
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="less">
.drawer-btn {
  position: absolute;
  bottom: 10px;
  left: 100px;
}
.y-item {
  display: flex;
  margin-bottom: 10px;
  .x-item {
    flex: 1;
    height: 50px;
    line-height: 50px;
    text-align: center;
    span {
      display: block;
      width: 100%;
      height: 100%;
      border: 1px solid #999;
      cursor: pointer;
      &.active {
        background-color: rgb(180, 37, 180);
        color: #ffffff;
      }
    }
  }
}
</style>
