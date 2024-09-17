import request from '@/utils/request'

// 获取考试登记列表
export function getExamRegisterList(query) {
	return request({
		url: '/labor/business/examinationregistration/page',
		method: 'get',
		params: query
	})
}

// 新增考试登记
export function addExamRegister(data) {
	return request({
		url: '/labor/business/examinationregistration',
		method: 'post',
		data: data
	})
}


// 修改考试登记
export function editExamRegister(data) {
	return request({
		url: '/labor/business/examinationregistration',
		method: 'put',
		data: data
	})
}

// 删除考试登记
export function delExamRegister(ids) {
	return request({
		url: '/labor/business/examinationregistration/'+ids,
		method: 'delete',
	})
}
