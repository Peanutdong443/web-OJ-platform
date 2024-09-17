
import request from '@/utils/request'

// 获取列表
export function getRoomList(data) {
	return request({
		url: '/api/getRoomList',
		method: 'post',
		data: data
	})
}


// 新增
export function addRoom(data) {
	return request({
		url: '/api/addRoom',
		method: 'post',
		data: data
	})
}


// 修改
export function editRoom(data) {
	return request({
		url: '/api/editRoom',
		method: 'put',
		data: data
	})
}

// 删除
export function delRoom(data) {
	return request({
		url: '/api/delRoom',
		method: 'delete',
		data: data
	})
}






// 获取列表
export function getSeatList(data) {
	return request({
		url: '/api/getSeatList',
		method: 'post',
		data: data
	})
}


// 新增
export function addSeat(data) {
	return request({
		url: '/api/addSeat',
		method: 'post',
		data: data
	})
}


// 修改
export function editSeat(data) {
	return request({
		url: '/api/editSeat',
		method: 'put',
		data: data
	})
}

// 删除
export function delSeat(data) {
	return request({
		url: '/api/delSeat',
		method: 'delete',
		data: data
	})
}
