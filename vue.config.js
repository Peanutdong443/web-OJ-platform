const {
	defineConfig
} = require('@vue/cli-service')
const timeStamp = new Date().getTime();
module.exports = defineConfig({
	publicPath: "./",
	transpileDependencies: true,
	lintOnSave: true,
	devServer: {
		port: 8080, // 端口号
		open: true, // 编译后默认打开浏览器
		host: 'localhost', // 域名
		proxy: {
			"/api": {
				target: "http://localhost:9090",
				changeOrigin: true,
				pathRewrite: {
					"^/api": ""
				}
			},
		}
	},
})