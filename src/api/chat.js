import request from '@/utils/request'

// 获取试题分类列表
export function getChatList(data) {
	return request({
		url: '/api/getChatList',
		method: 'post',
		data: data
	})
}
export function delChat(data) {
	return request({
		url: '/api/delChat',
		method: 'delete',
		data: data
	})
}
