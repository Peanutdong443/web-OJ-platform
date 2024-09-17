/*
 * @Author: lzz
 * @Date: 2024-02-27 20:31:20
 * @LastEditTime: 2024-06-01 10:50:12
 */
import request from '@/utils/request'

// 获取列表
export function getFeedbackList(data) {
	return request({
		url: '/api/getFeedbackList',
		method: 'post',
		data: data
	})
}


// 新增
export function addFeedback(data) {
	return request({
		url: '/api/addFeedback',
		method: 'post',
		data: data
	})
}


// 修改
export function editFeedback(data) {
	return request({
		url: '/api/editFeedback',
		method: 'put',
		data: data
	})
}

// 删除
export function delFeedback(data) {
	return request({
		url: '/api/delFeedback',
		method: 'delete',
		data: data
	})
}
