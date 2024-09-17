<template>
    <el-container style="height: 100vh;">
        <el-aside width="250px">
            <AppAside />
        </el-aside>
        <el-container>
            <el-header>
                <AppHeader />
            </el-header>
            <el-main>
                <el-card class="box-card">
                    <router-view>
                    </router-view>
                </el-card>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import AppHeader from "@/components/appComponents/AppHeader.vue"
import AppAside from "@/components/appComponents/AppAside.vue"
import '@/theme/theme.less'
import '@/theme/common.less'
export default {
    name: 'Home',
    components: {
        AppHeader, // 头部
        AppAside, // 侧边栏
    },
    methods: {
    },
}
</script>
<style lang="less">
.search-bar .el-form--inline .el-form-item {
    margin-bottom: 10px;
}

.page-wrapper {
    text-align: right;
    margin-top: 10px;
}

/*定义了滚动条整体样式；*/
::-webkit-scrollbar {
    height: 8px !important;
    width: 8px !important;
    border-radius: 10px;
}

/*定义了滚动条滑块的样式*/
::-webkit-scrollbar-thumb {
    border-radius: 0;
    border-style: dashed;
    background-color: #dadbdd;
    border-color: #e2242400;
    border-width: 1.5px;
    background-clip: padding-box;
}

/*定义了轨道的样式*/

::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    // background: #EDEDED;
    background: transparent;
}
</style>
<style lang="less" scoped>
.box-card {
    display: inline-block;
    width: 99.5%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;

}

.el-main {
    padding: 0;
    border-radius: 10px;
    margin-top: 2px;
    height: calc(100vh - 80px);

    // 以下四行隐藏滚动条
    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
    overflow: hidden;

    &::-webkit-scrollbar {
        display: none;
        /* Chrome Safari */
    }
}

.el-aside {
    border-right: 1px solid;
    border-color: rgba(255, 255, 255, 0.3);
}
</style>