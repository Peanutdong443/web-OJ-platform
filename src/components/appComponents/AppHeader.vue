<template>
    <div class="top-container">
        <div class="title">
        </div>
        <div class="right">
            <div class="line"></div>
            <el-dropdown placement="bottom">

                <div class="el-dropdown-link">
                    <el-avatar class="avatarshow" :src="this.avatar" icon="el-icon-user-solid" :size="50" fit="fill"></el-avatar>
                </div>
                <el-dropdown-menu slot="dropdown" class="header-new-drop">
                    <el-dropdown-item class="drop-text" style="color: rgb(125,11,65);" @click.native="logout">退出登录
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import ChangePassword from "./ChangePassword.vue";
import { EventBus } from '../../api/EventBus.js';
export default {
    data() {
        return {
            userInfo: {},
            avatar: null,
        }
    },
    components: {
        ChangePassword,
    },
    created() {
        this.avatar = localStorage.getItem("avatarUrl");
        EventBus.$on('changeAvatar', this.changeAvatar);
    },
    beforeDestroy() {
        EventBus.$off('changeAvatar', this.changeAvatar);
    },
    methods: {
        logout() {
            localStorage.clear();
            this.avatar = null;
            this.$router.push('/login')
        },
        changeAvatar() {
            this.avatar = localStorage.getItem("avatarUrl");
        },

    }
}
</script>
<style lang="less" scoped>
.top-container {
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .title {
        font-size: 20px;
    }

    .right {
        height: 100%;
        width: 500px;
        flex: 1;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: end;

        .date,
        .time {
            height: 100%;
            font-size: 16px;
            color: #666;
            line-height: 80px;
            text-align: right;
            padding-right: 10px;
        }
    }
}

.el-dropdown-link {
    width: 30px;
    height: 30px;
    cursor: pointer;

    span {
        display: block;
    }
}

.el-dropdown {
    width: 30px;
    height: 30px;
    font-size: 30px;
}

.changeTheme {
    margin-right: 25px;

    .el-icon-s-open {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
}

.avatarshow{
    border: 1px solid rgb(231, 229, 229);
}

.drop-text {
    color: rgb(125, 11, 65);
    &:hover {
        background-color: rgb(125, 11, 65) !important;
        color: white !important;
    }
}
</style>