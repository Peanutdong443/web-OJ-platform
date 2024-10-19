
<template>
  <div class="info-notice-wrapper">
    <div class="search-container">
      <el-card class="box-card">
        <div class="content-container" style="display: inline-block; vertical-align: top">
          <el-form ref="form" :inline="true" class="search-form" :model="queryParams">
            <el-form-item >
              <el-input v-model="queryParams.name" style="width:500px;" placeholder="请输入需要查询的实验名称或id" clearable></el-input>
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
        <el-table-column v-if="this.usertype=='2'" prop="name" label="提交状态" align="center">
          <template slot-scope="scope">
            {{ submitRecordMap[scope.row.id] ? "已提交" : "未提交" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="400px">
          <template slot-scope="scope" >
            <el-button
                v-if="usertype == '2'"
                size="mini"
                style="color:white;background-color:rgb(125,11,65);"
                @click="handleToSubmitWork(scope.$index, scope.row)"
            >
              提交实验
            </el-button>
            <el-button
                v-if="usertype=='1'"
                size="mini"
                style="color:white;background-color:rgb(125,11,65);"
                @click="handleToDetails(scope.$index, scope.row)"
            >
              实验详情
            </el-button>
            <el-button
                v-if="usertype=='1'"
                size="mini"
                style="color:white;background-color:rgb(125,11,65);"
                @click="handleToRecords()"
            >
              提交记录
            </el-button>
            <el-button
                v-if="usertype=='2'"
                size="mini"
                style="color:white;background-color:rgb(125,11,65);"
                @click="getsubmitlist(0)"
            >
              提交记录
            </el-button>
          </template>


        </el-table-column>
      </el-table>
    </div>
    <el-drawer title="实验详情" :visible.sync="DetailsVisible" :before-close="handleClearDetails" size="1000px"
               v-loading="examDetailsLoading" :close-on-click-modal="false">
      <div style="padding: 15px">
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px"
                 style="height: calc(100vh - 150px); overflow-y: auto" v-if="DetailsVisible">
          <el-form-item >
            <span style="font-size: 20px;color:rgb(125,11,65); ">实验内容</span>
            <div v-html="html"></div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-drawer title="本班提交记录汇总" :visible.sync="SubmitRecordsVisible" :before-close="handleClearRecordsDetails" size="1000px"
               v-loading="examDetailsLoading" :close-on-click-modal="false">
      <div style="padding: 15px">

        <div class="search-container">
          <el-card class="box-card">
            <div style="display: inline-block; vertical-align: top">
              <el-form ref="" :inline="true" class="search-form" model="">
                <el-form-item>
                  <el-input v-model="StuQueryInfo.query" style="width:500px;" placeholder="请输入需要查询的学生账号或姓名"
                            clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="search-btn-container" style="display: inline-block; vertical-align: top">
                    <el-button @click="getStuList()" round  style="color:white;background-color:rgb(125,11,65);margin-top:2px;" size="medium">查询</el-button>
                  </div>
                </el-form-item>

              </el-form>
            </div>
          </el-card>
        </div>
        <div class="table-content" style="width: 80%;">
          <el-table :data="StuTableData" style="width: 100%" border max-height="600px">
            <el-table-column prop="uid" label="账号" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" align="center"></el-table-column>
            <el-table-column label="提交记录" align="center" width="280px">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="getsubmitlist(scope.row.uid)">查看提交记录</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页组件 -->
        <div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="StuQueryInfo.pageNum" :page-sizes="[1, 2, 5, 100]" :page-size="StuQueryInfo.pageSize"
                         layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>

    </el-drawer>

    <el-drawer class="drawer" title="提交实验" direction="ttb" :visible.sync="submitWorkVisible"  size="750px"
               :close-on-click-modal="false">
      <div style="padding: 15px">
        <el-form :model="submitForm" :rules="rules"  label-width="100px"
                 style="height: calc(100vh - 150px); overflow-y: auto" v-if="submitWorkVisible">
          <el-form-item  class="text">
            <div v-html="html"></div>
            <el-divider content-position="center"><h2 style="color:rgb(125,11,65);font-size: 20px;">代码编写</h2></el-divider>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button v-loading="loading" @click="handleSubmitItem()" style="color:white;background-color:rgb(125,11,65);">提 交</el-button>
            <el-button @click="clearEditor()" style="background-color:#ccc;">重 置</el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-select v-model="value"  filterable placeholder="请选择代码语言">
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
    <el-drawer title="个人提交" :visible.sync="sublistVisible" :before-close="handlesbmlist" size="1000px"
               :close-on-click-modal="false">
      <div style="padding: 15px;width: 100%;">
        <el-table :data="submitTableData" style="width: 100%" border max-height="600px">
          <el-table-column prop="sbmid" label="提交编号" align="center"></el-table-column>
          <el-table-column label="语言" align="center">
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.languageid==75">C (Clang 7.0.1)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==49">C (GCC 8.3.0)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==76">C++ (Clang 7.0.1)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==54">C++ (GCC 9.2.0)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==62">Java (OpenJDK 13.0.1)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==71">Python (3.8.1)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==72">Python (2.7.17)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==73">Rust (1.40.0)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==70">Go (1.13.5)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==63">JavaScript (Node.js 12.14.0)</el-tag>
              <el-tag type="primary" v-if="scope.row.languageid==59">Fortran (GFortran 9.2.0)</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sourcecode" label="源码" align="center"></el-table-column>
          <el-table-column label="检查结果" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status=='3'">结果正确</el-tag>
              <el-tag type="warning" v-if="scope.row.status=='6'">编译错误</el-tag>
              <el-tag type="warning" v-if="scope.row.status=='7'||scope.row.status=='8'||scope.row.status=='9'||scope.row.status=='10'||scope.row.status=='11'||scope.row.status=='12'">运行超时</el-tag>
              <el-tag type="danger" v-if="scope.row.status=='4'">结果错误</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="passednum" label="通过样例数" align="center"></el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import http from "../../http.js";

import {PrismEditor} from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import {highlight, languages} from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'

export default {
  data() {
    return {
      //代码编辑相关变量
      sourcecode: '',
      lineNumbers: true,

      //提交表单相关变量
      submitForm: {
        qid: '',
        language: null,
        codebytes: '',
      },
      tagcontent: '检查结果',
      tagstatus: '',
      loading: false,

      // 抽屉中学生查询相关变量定义
      StuQueryInfo: {
        query: [],
        pageNum: 1,
        pageSize: 5,
      },
      total: 0,

      //学生信息
      StuTableData: [{
        uid: 0,
        temp: 0,
      }],
      sublistVisible: false,

      //提交记录信息
      submitQueryInfo: {
        uid: '',
        qid: '',
      },

      submitTableData: [{
        qid: '',
        sourcecode: '',
        status: '',
      }],


      options: [{
        value: 75,
        label: 'C (Clang 7.0.1)'
      }, {
        value: 49,
        label: 'C (GCC 8.3.0)'
      }, {
        value: 76,
        label: 'C++ (Clang 7.0.1)'
      }, {
        value: 54,
        label: 'C++ (GCC 9.2.0)'
      }, {
        value: 62,
        label: 'Java (OpenJDK 13.0.1)'
      }, {
        value: 71,
        label: 'Python (3.8.1)'
      }, {
        value: 72,
        label: 'Python (2.7.17)'
      }, {
        value: 73,
        label: 'Rust (1.40.0)'
      }, {
        value: 60,
        label: 'Go (1.13.5)'
      }, {
        value: 63,
        label: 'JavaScript (Node.js 12.14.0)'
      }, {
        value: 59,
        label: 'Fortran (GFortran 9.2.0)'
      },
      ],
      value: '',
      submitWorkVisible: false,
      examDetailsLoading: false,
      usertype: "",
      DetailsVisible: false,
      SubmitRecordsVisible: false,


      tableData: [],
      queryParams: {
        name: "",
      },
      userType: 1,
      tableLoading: false,
      dialogTitle: "新增内容",
      formLabelWidth: "100px",
      types: [],
      tableHeight: 600,
      currentRoom: null,
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
  created() {
    this.getUsertype();
  },
  mounted() {
    this.dbInit().then((res) => {
      this.handleSearch();
    });
    this.dbInit2();
    this.handleSearchSubmitRecord();
  },
  methods: {

    async getUsertype() {
      const {data: res} = await http.get("getUsertype", {
        headers: {
          'Authorization': '' + localStorage.getItem("token")
        }
      });
      if (res.code != 200) return this.$message.error("获取用户类型失败");
      this.usertype = res.data.usertype;
      return JSON.stringify(res.data.usertype);
    },

    highlighter(code) {
      return highlight(code, languages.js) //returns html
    },

    clearEditor() {
      this.sourcecode = '';
      this.value = '';
    },
    async getStuList() {
      console.log(this.StuTableData);
      const {data: res} = await http.get("/getStuList",
          {
            params: {
              sid: this.StuQueryInfo.query,
              pageNum: this.StuQueryInfo.pageNum,
              pageSize: this.StuQueryInfo.pageSize,
            }
          });
      if ((this.StuTableData = res.data.list) != null) this.SubmitRecordsVisible = true;
      this.total = res.data.total;
      console.log(this.StuTableData);
    },

    async getsubmitlist(id) {
      console.log(this.submitTableData);
      this.submitQueryInfo.uid = id;
      this.submitQueryInfo.qid = '1';
      const {data: res} = await http.get("/getsubmitlist",
          {
            params: {
              uid: this.submitQueryInfo.uid,
              qid: this.submitQueryInfo.qid,
            }
          }
      );
      if((this.submitTableData= res.data)!=null)this.sublistVisible=true;
      console.log(this.submitTableData);
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
            db.createObjectStore("exam", {keyPath: "id"});
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
            db.createObjectStore("submitWork", {keyPath: "id"});
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
    resize() {
      this.tableHeight = document.documentElement.clientHeight - 245;
    },
    async handleSubmitItem() {

      this.loading = true;

      const encoder = new TextEncoder();
      const bytes = encoder.encode(this.sourcecode);
      // 将字节数组转换为 Base64 字符串
      const base64Codebytes = btoa(String.fromCharCode(...bytes));

      //提交完整性判断
      if (this.value == '') {
        this.$message.error("请选择语言");
        this.loading = false;
        return;
      } else if (this.sourcecode == '') {
        this.$message.error("无法提交空代码");
        this.loading = false;
        return;
      }

      // 更新提交表单
      this.submitForm.codebytes = base64Codebytes;
      this.submitForm.language = this.value;

      const {data: res} = await http.post("submitcode", this.submitForm);
      if (res.code == 200) {
        this.$message.success("提交成功");
        this.loading = false;
        switch (res.data.status) {
          case "4":
            this.tagcontent = "结果错误";
            this.tagstatus = "danger";
            break;
          case "6":
            this.tagcontent = "编译错误";
            this.tagstatus = "warning";
            break;
          case "8" || "7" || "9" || "10" || "11" || "12":
            this.tagcontent = "运行超时";
            this.tagstatus = "warning";
            break;
          case "3":
            this.tagcontent = "结果正确";
            this.tagstatus = "success";
            break;
        }
      } else {
        this.$message.error("提交失败");
        this.loading = false;
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
    handleClearDetails() {
      this.DetailsVisible = false;
      this.examDetailsLoading = false;
    },
    handleClearRecordsDetails() {
      this.SubmitRecordsVisible = false;
    },
    handleToSubmitWork(id, row) {
      this.html = row.content;
      this.currentExam = row;
      this.html2 = "";
      this.submitWorkVisible = true;
    },
    handleToDetails(id, row) {
      this.html = row.content;
      this.currentExam = row;
      this.html2 = "";
      this.DetailsVisible = true;
    },
    handleToRecords() {
      this.getStuList();
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


    handleSizeChange(newSize) {
      this.StuQueryInfo.pageSize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.StuQueryInfo.pageNum = newPage;
      this.getUserList();
    },

    handlesbmlist() {
      this.sublistVisible = false;
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
  position: absolute;
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

.tag {
  width: 100px;
}

.el-drawer__header {
  /* 修改标题容器的样式，例如颜色、字体大小等 */
  color: rgb(125, 11, 65);
  font-size: 30px;
  text-align: center;
}

.drawer {
  background-color: rgb(125, 11, 65);
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


