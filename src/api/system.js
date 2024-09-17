import request from '@/utils/request'

// 获取收费标准列表
export function getMemberFeeStandardList(query) {
	return request({
		url: '/labor/business/memberFeeStandard/list',
		method: 'get',
		params: query
	})
}

// 新增收费标准
export function addMemberFeeStandard(data) {
	return request({
		url: '/labor/business/memberFeeStandard',
		method: 'post',
		data: data
	})
}

// 修改收费标准
export function editMemberFeeStandard(data) {
	return request({
		url: '/labor/business/memberFeeStandard',
		method: 'put',
		data: data
	})
}

// 删除收费标准
export function delMemberFeeStandard(ids) {
	return request({
		url: '/labor/business/memberFeeStandard/' + ids,
		method: 'delete',
	})
}


// ------------------------------------角色------------------------------------------------------------------
// 获取角色列表
export function getRoleList(query) {
	return request({
		url: '/labor/system/role/page',
		method: 'get',
		params: query
	})
}

// 获取所有角色
export function getRoleAll(query) {
	return request({
		url: '/labor/system/role/all',
		method: 'get',
		params: query
	})
}



// 获取角色选择框列表
export function getRoleOptionselect(query) {
	return request({
		url: '/labor/system/role/',
		method: 'get',
		params: query
	})
}
// 获取角色详情
export function getRoleById(roleId) {
	return request({
		url: '/labor/system/role/' + roleId,
		method: 'get',
	})
}
// 新增角色
export function addRole(data) {
	return request({
		url: '/labor/system/role',
		method: 'post',
		data: data
	})
}


// 修改角色
export function editRole(data) {
	return request({
		url: '/labor/system/role',
		method: 'put',
		data: data
	})
}

// 删除角色
export function delRole(ids) {
	return request({
		url: '/labor/system/role/' + ids,
		method: 'delete',
	})
}

// ------------------------------------账号------------------------------------------------------------------

// 获取用户列表
export function getUserList(query) {
	return request({
		url: '/labor/system/user/page',
		method: 'get',
		params: query
	})
}
// 重新修改密码
export function updatePwd(data) {
	return request({
		url: '/labor/system/user/profile/updatePwd',
		method: 'put',
		params: data
	})
}
// 新增用户
export function addUser(data) {
	return request({
		url: '/labor/system/user',
		method: 'post',
		data: data
	})
}


// 修改用户
export function editUser(data) {
	return request({
		url: '/labor/system/user',
		method: 'put',
		data: data
	})
}

// 删除用户
export function delUser(ids) {
	return request({
		url: '/labor/system/user/' + ids,
		method: 'delete',
	})
}
// 重置密码
export function resetPwd(data) {
	return request({
		url: '/labor/system/user/resetPwd',
		method: 'put',
		data: data
	})
}

// 修改个人密码
export function resetUserPwd(oldPassword, newPassword) {
	return request({
		url: '/labor/system/user/profile/updatePwd?oldPassword=' + oldPassword + '&newPassword=' + newPassword,
		method: 'put',
	})
}

// ------------------------------------菜单------------------------------------------------------------------

// 获取菜单列表
export function getMenuTree(query) {
	return request({
		url: '/labor/system/menu/treeselect',
		method: 'get',
		params: query
	})
}


// 获取菜单列表
export function getMenuList(query) {
	return request({
		url: '/labor/system/menu/list',
		method: 'get',
		params: query
	})
}

// 新增菜单
export function addMenu(data) {
	return request({
		url: '/labor/system/menu',
		method: 'post',
		data: data
	})
}

// 修改菜单
export function editMenu(data) {
	return request({
		url: '/labor/system/menu',
		method: 'put',
		data: data
	})
}

// 删除菜单
export function delMenu(ids) {
	return request({
		url: '/labor/system/menu/' + ids,
		method: 'delete',
	})
}

// ---------------------------------------------------------------------会员


// 获取会员列表
export function getMemberList(query) {
	return request({
		url: '/labor/business/member/page',
		method: 'get',
		params: query
	})
}


// 修改会员
export function editMember(data) {
	return request({
		url: '/labor/business/member',
		method: 'put',
		data: data
	})
}

// 删除会员
export function delMember(ids) {
	return request({
		url: '/labor/business/member/' + ids,
		method: 'delete',
	})
}


//------------------------------------------------------------------------------ 文件操作

// 上传文件
export function uploadFile(data) {
	return request({
		url: '	',
		method: 'post',
		data: data
	})
}
//下载文件
export function downloadFile(storeName) {
	return request({
		url: '/labor/system/osfile/download/' + storeName,
		method: 'post',
		responseType: "blob",
	})
}
//下载文件
export function downloadTemplate() {
	return request({
		url: '/labor/business/question/downloadTemplate/',
		method: 'post',
		responseType: "blob",
	})
}
// ---------------------------------------------------------------------轮播


// 获取轮播列表
export function getSwiperList(query) {
	return request({
		url: '/labor/business/carousel/page',
		method: 'get',
		params: query
	})
}

// 新增轮播
export function addSwiper(data) {
	return request({
		url: '/labor/business/carousel',
		method: 'post',
		data: data
	})
}
// 修改轮播
export function editSwiper(data) {
	return request({
		url: '/labor/business/carousel',
		method: 'put',
		data: data
	})
}

// 删除轮播
export function delSwiper(ids) {
	return request({
		url: '/labor/business/carousel/' + ids,
		method: 'delete',
	})
}

//----------------------------------------------数据接口
export function getCount(code) {
	return request({
		url: '/labor/query/data/countByCode/' + code,
		method: 'post',
		data: {}
	})
}


// -----------------------------------------------购买记录
export function getMemberbuyRecord(query) {
	return request({
		url: '/labor/business/memberbuyrecord/page',
		method: 'get',
		params: query
	})
}

// 获取分类列表
export function getCategotyList(query) {
	return request({
		url: '/api/category/getList',
		method: 'get',
		params: query
	})
}


// 修改分类
export function editCategory(data) {
	return request({
		url: '/api/category/editCategory',
		method: 'put',
		data: data
	})
}

// 新增分类
export function addCategory(data) {
	return request({
		url: '/api/category/addCategory',
		method: 'post',
		data: data
	})
}

// 获取学习记录
export function getStudyRecord() {
	return request({
		url: '/api/study/getAll',
		method: 'get',
	})
}

// 删除学习记录
export function deleteStudyRecord(id) {
	return request({
		url: '/api/study/'+id,
		method: 'delete',
	})
}

// 新增试题
export function addQuestion(data) {
	return request({
		url: '/api/question/addQuestion',
		method: 'post',
		data: data
	})
}
// 查询题库
export function getQuestion() {
	return request({
		url: '/api/question/getAll',
		method: 'get',
	})
}

// 查询题库byId
export function getQuestionById(id) {
	return request({
		url: '/api/question/get/'+id,
		method: 'get',
	})
}
// 删除试题
export function deleteQuestion(id) {
	return request({
		url: '/api/question/'+id,
		method: 'delete',
	})
}



// 新增试题
export function addSubject(data) {
	return request({
		url: '/api/subject',
		method: 'post',
		data: data
	})
}
// 查询题库
export function getSubject() {
	return request({
		url: '/api/subject/getAll',
		method: 'get',
	})
}

// 查询题库byId
export function getSubjectByQuestionId(id) {
	return request({
		url: '/api/subject/getSubjectByQuestionId'+id,
		method: 'get',
	})
}
// 删除试题
export function deleteSubject(id) {
	return request({
		url: '/api/subject/'+id,
		method: 'delete',
	})
}



// 修改试题
export function editQuestion(data) {
	return request({
		url: '/api/question/updateQuestion',
		method: 'put',
		data: data
	})
}