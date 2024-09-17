/*
 * @Author: lzz
 * @Date: 2024-02-27 20:31:20
 * @LastEditTime: 2024-05-31 22:14:02
 */
import request from '@/utils/request'

// 获取列表
export function getStudentList(data) {
	return request({
		url: '/api/getStudentList',
		method: 'post',
		data: data
	})
}


// 新增
export function addStudent(data) {
	return request({
		url: '/api/addStudent',
		method: 'post',
		data: data
	})
}


// 修改
export function editStudent(data) {
	return request({
		url: '/api/editStudent',
		method: 'put',
		data: data
	})
}

// 删除
export function delStudent(data) {
	return request({
		url: '/api/delStudent',
		method: 'delete',
		data: data
	})
}

// 获取列表
export function getCollegeList(data) {
	return request({
		url: '/api/getCollegeList',
		method: 'post',
		data: data
	})
}


// 获取列表
export function getMajorList(data) {
	return request({
		url: '/api/getMajorList',
		method: 'post',
		data: data
	})
}
