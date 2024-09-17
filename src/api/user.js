import request from '@/utils/request'

// 获取用户列表
export function getUserList(query) {
	return request({
		url: '/api/user/getUser',
		method: 'get',
		params: query
	})
}


// 新增用户
export function addUser(data) {
	return request({
		url: '/api/user/addUser',
		method: 'post',
		data: data
	})
}


// 修改用户
export function editUser(data) {
	return request({
		url: '/api/user/updateUser',
		method: 'put',
		data: data
	})
}

// 删除用户
export function delUser(ids) {
	return request({
		url: '/api/user/'+ids,
		method: 'delete',
	})
}
