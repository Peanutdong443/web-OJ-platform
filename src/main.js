import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import router from './router/router';
import 'element-ui/lib/theme-chalk/index.css';
import indexDb from './db/indexDB';
import './assets/font/iconfont.css'
indexDb.openDB('pure', 1, function(db){
  Vue.prototype.$tableDb = db //全局保存数据库
})
import {
  Message,
  Container,
  Header,
  Aside,
  Main,
  Card,
  Row,
  Col,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Select,
  Option,
  Input,
  InputNumber,
  Button,
  Drawer,
  Switch,
  Dialog,
  Pagination,
  MessageBox,
  Popconfirm,
  Table,
  TableColumn,
  Badge,
  Divider,
  Tree,
  Avatar,
  Radio,
  RadioGroup,
  RadioButton,
  DatePicker,
  Tabs,
  TabPane,
  Loading,
  Upload,
  Cascader,
  CascaderPanel,
  Descriptions,
  DescriptionsItem,
  Tag,
  // Footer,
} from 'element-ui';

Vue.component(Message.name, Message);
Vue.use(Container)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Tag)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Button);
Vue.use(Drawer);
Vue.use(Switch);
Vue.use(InputNumber);
Vue.use(Dialog);
// Vue.use(MessageBox);
Vue.use(Popconfirm);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Badge);
Vue.use(Pagination);
Vue.use(Divider);
Vue.use(Avatar);
Vue.use(Tree);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(DatePicker);
Vue.use(Loading);
Vue.use(Upload);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Cascader);
Vue.use(CascaderPanel);

Vue.prototype.$axios = axios
Vue.prototype.$message = Message;
// 下边的用啥解啥
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')