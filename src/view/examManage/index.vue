
<template>
  <div class="info-notice-wrapper">
    <div class="search-container">
      <el-card class="box-card">
        <div class="content-container" style="display: inline-block; vertical-align: top">
          <el-form ref="form" :inline="true" class="search-form" :model="queryParams">
            <el-form-item label="实验名称">
              <el-input v-model="queryParams.name" placeholder="请输入实验名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <div class="search-btn-container" style="display: inline-block; vertical-align: top">
                <el-button round  style="color:white;background-color:rgb(125,11,65);margin-top:2px" @click="handleSearch()" size="medium" >查询</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <!-- 中 数据表格 -->
    <div class="table-content">
      <el-table :data="tableData" style="width: 100%" border :max-height="tableHeight" v-loading="tableLoading"
        tooltip-effect="light">
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column prop="name" label="实验名称" align="center"></el-table-column>
        <el-table-column prop="name" label="提交状态" align="center">
          <template slot-scope="scope">
            {{ submitRecordMap[scope.row.id] ? "已提交" : "未提交" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280px">
          <template slot-scope="scope">
            <el-button size="mini" style="color:white;background-color:rgb(125,11,65);" @click="handleToSubmitWork(scope.$index, scope.row)">{{ userType != "yk" ? "提交实验" :
              "查看实验" }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer title="实验详情"  :visible.sync="examDetailsVisible" :before-close="handleClearExamDetails" size="1000px"
               v-loading="examDetailsLoading" :close-on-click-modal="false">
      <div style="padding: 15px">
        <el-form :model="formData" :rules="rules" ref="ruleForm" :label-width="formLabelWidth"
          style="height: calc(100vh - 150px); overflow-y: auto" v-if="examDetailsVisible">
          <el-form-item label="实验内容">
            <div v-html="html"></div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-drawer class="drawer" title="提交实验" direction="ttb" :visible.sync="submitWorkVisible" :before-close="handleClearForm" size="750px"
      :close-on-click-modal="false">
      <div style="padding: 15px">
        <el-form :model="formData" :rules="rules" ref="ruleForm" :label-width="formLabelWidth"
          style="height: calc(100vh - 150px); overflow-y: auto" v-if="submitWorkVisible">
          <el-form-item  class="text">
            <div v-html="html"></div>
            <el-divider content-position="center"><h2 style="color:rgb(125,11,65);font-size: 20px;">代码编写</h2></el-divider>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button v-loading="loading" @click="handleSubmitItem()" style="color:white;background-color:rgb(125,11,65);">提 交</el-button>
            <el-button @click="clearEditor()" style="background-color:#ccc;">重 置</el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-select v-model="submitForm.langage" filterable placeholder="请选择代码语言">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-tag :type="tagstatus" size="large">{{tagcontent}}</el-tag>
          </el-form-item>
          <el-form-item>
            <prism-editor class="my-editor height-300" id="editor" v-model="sourcecode"
                          :highlight="highlighter" :line-numbers="lineNumbers">
            </prism-editor>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import http from "../../http.js";

import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
export default {
  data() {
    return {

      sourcecode:'',
      lineNumbers: true,
      tagcontent:'检查结果',
      tagstatus:'',
      loading:false,

      submitForm:{
        qid:'',
        langage:'',
        codebytes:'',
      },


      options: [{
        value: 75,
        label: 'C (Clang 7.0.1)'
      }, {
        value: 49,
        label: 'C (GCC 8.3.0)'
      },{
        value: 76,
        label: 'C++ (Clang 7.0.1)'
      }, {
        value: 54,
        label: 'C++ (GCC 9.2.0)'
      },{
        value: 62,
        label: 'Java (OpenJDK 13.0.1)'
      }, {
        value: 71,
        label: 'Python (3.8.1)'
      },{
        value: 72,
        label: 'Python (2.7.17)'
      }, {
        value: 73,
        label: 'Rust (1.40.0)'
      },{
        value: 60,
        label: 'Go (1.13.5)'
      },{
        value: 63,
        label: 'JavaScript (Node.js 12.14.0)'
      },{
        value: 59,
        label: 'Fortran (GFortran 9.2.0)'
      },

      ],
      value: '',

      tableData: [],
      queryParams: {
        name: "",
      },
      userType: localStorage.getItem("userType"),
      tableLoading: false,
      examDetailsLoading: false,
      dialogTitle: "新增内容",
      examDetailsVisible: false,
      formLabelWidth: "100px",
      types: [],
      tableHeight: 600,
      currentRoom: null,
      submitWorkVisible: false,
      formData: {
        name: "",
      },
      html: "",
      html2: "",
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
      submitRecordMap: [],
      rules: {},
      seatMap: {},
      currentExam: {},
      indexedDB:
        window.indexedDB ||
        window.webkitindexedDB ||
        window.msIndexedDB ||
        window.mozIndexedDB, //兼容
      editor: null,
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
    PrismEditor
  },
  mounted() {
    this.dbInit().then((res) => {
      this.handleSearch();
    });
    this.dbInit2();
    this.handleSearchSubmitRecord();
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  methods: {

    highlighter(code) {
      return highlight(code, languages.js) //returns html
    },

    clearEditor(){
     this.sourcecode='';
     this.value='';
    },

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
    dbInit2() {
      return new Promise((resolve, reject) => {
        const connection = this.indexedDB.open("dbname3", 2);
        connection.onblocked = function (event) {
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
          if (!db.objectStoreNames.contains("submitWork")) {
            db.createObjectStore("submitWork", { keyPath: "id" });
          }
        };
        //失败回调
        connection.onerror = function (err) {
          reject(err);
        };
      });
    },
    async dbOperation(type, data) {
      let typeList = ["add", "get", "getAll", "delete", "put"]; //方法名字
      if (!typeList.includes(type)) {
        throw new Error(`操作类型错误, 仅支持: ${typeList.toString()} 方法`);
      }
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
    //type 方法类型  data第几条
    async dbOperation2(type, data) {
      let typeList = ["add", "get", "getAll", "delete", "put"]; //方法名字
      //如果传的值不在这个列表中
      if (!typeList.includes(type)) {
        throw new Error(`操作类型错误, 仅支持: ${typeList.toString()} 方法`);
      }
      //事务模式有两个选项 readonly 或 readwrite ，默认为 readonly 模式，只读和写入数据
      const readType =
        type === "add" || "delete" || "put" ? "readwrite" : "readonly";
      const res = await this.dbInit2();
      const objectStore = res
        .transaction("submitWork", readType)
        .objectStore("submitWork");

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
    //初始化对话框，重置对话框
    handleClearForm() {
      this.submitWorkVisible = false;
    },
    resize() {
      this.tableHeight = document.documentElement.clientHeight - 245;
    },
    async handleSubmitItem() {

      this.loading=true;

      const encoder = new TextEncoder();
      const bytes = encoder.encode(this.sourcecode);
      this.submitForm.codebytes=bytes;
      const {data:res}=await http.post("submitcode",{ params: {
          qid: this.submitForm.qid,
          language: this.submitForm.langage,
          codebytes: this.submitForm.codebytes,
        }});
      if(res.code==200){
        this.$message.success("提交成功");
        this.loading=false;
        switch (res.data.status){
          case "4":this.tagcontent="结果错误";this.tagstatus="danger";break;
          case "6":this.tagcontent="编译错误";this.tagstatus="warning";break;
          case "8"||"7"||"9"||"10"||"11"||"12":this.tagcontent="运行超时";this.tagstatus="warning";break;
          case "3":this.tagcontent="结果正确";this.tagstatus="success";break;
        }
      }else {
        this.$message.error("提交失败");
        this.loading=false;
      }
    },




    async handleSearchSubmitRecord() {
      const res = await this.dbOperation2("getAll");
      for (let i = 0; i < res.length; i++) {
        let item = res[i];
        if (item.username == localStorage.getItem("username")) {
          this.submitRecordMap[item.examId] = item;
        }
      }
      console.log("submitRecordMap", this.submitRecordMap);
    },
    //初始化对话框，重置对话框
    handleClearExamDetails() {
      this.examDetailsVisible = false;
      this.examDetailsLoading = false;
    },
    handleToSubmitWork(id, row) {
      this.html = row.content;
      this.currentExam = row;
      if (this.userType == "yk") {
        this.examDetailsVisible = true;
      } else {
        this.html2 = "";
        this.submitWorkVisible = true;
      }
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

.my-editor {
  background: #2d2d2d;
  color: #ccc;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
  resize: both;
  overflow: auto;
  position:absolute;
  left: 200px;
}

/* optional */
.prism-editor__textarea:focus {
  outline: none;
}

/* not required: */
.height-300 {
  height: 600px;
  width: 900px;
}

.tag{
  width: 100px;
}

.el-drawer__header {
  /* 修改标题容器的样式，例如颜色、字体大小等 */
  color: rgb(125,11,65);
  font-size: 30px;
  text-align: center;
}
.drawer{
  background-color: rgb(125,11,65);
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
