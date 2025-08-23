import request from '@/utils/request'
import { iResponse } from '@/services/types'
import { TenantAddParams, DepartmentAddParams, UserAddParams } from '@/views/user/types'

interface loginParams {
  username: string
  password: string
}

// Change Password
interface changePasswordParams {
  username: string
  old_password: string
  new_password: string
}

export default () =>
  new (class {
    // Get verification code
    initCaptcha(): Promise<iResponse> {
      return request.get('/captcha/refresh')
    }

    // Login
    login(params: loginParams): Promise<iResponse> {
      return request.post('/user/login', params)
    }

    // Get user information
    getUserInfo(): Promise<iResponse> {
      return request.get('/user/info')
    }

    // logout
    logout(): Promise<iResponse> {
      return request.get('/user/logout')
    }

    // changePassword
    changePassword(params: changePasswordParams): Promise<iResponse> {
      return request.post('/user/changePassword', params)
    }

    // 用户函数
    userList(params: {
      page: number
      pageSize: number
      keywords?: string
    }): Promise<iResponse> {
      return request.get('/user/list', { params })
    }

    userAdd(params: UserAddParams): Promise<iResponse> {
      return request.post('/user/add', params)
    }

    userEdit(params: UserAddParams): Promise<iResponse> {
      return request.post('/user/update', params)
    }

    userDelete(params: { id: number }): Promise<iResponse> {
      return request.post('/user/delete', params)
    }

    // Get user token and system update URL
    userToken(): Promise<iResponse> {
      return request.get('/user/token')
    }

    userLock(params: { id: number }): Promise<iResponse> {
      return request.post('/user/lock', params)
    }

    userUnlock(params: { id: number }): Promise<iResponse> {
      return request.post('/user/unlock', params)
    }

    userReset(params: { id: number }): Promise<iResponse> {
      return request.post('/user/reset', params)
    }

    // 租户函数
    tenantList(params: {
      page: number
      pageSize: number
      keywords?: string
    }): Promise<iResponse> {
      return request.get('/tenant/list', {params})
    }

    tenantAll(): Promise<iResponse> {
      return request.get('/tenant/list')
    }

    tenantAdd(params: TenantAddParams): Promise<iResponse> {
      return request.post('/tenant/add', params)
    }

    tenantDelete(params: {id: number}): Promise<iResponse> {
      return request.post('/tenant/delete', params)
    }

    tenantEdit(params: TenantAddParams): Promise<iResponse> {
      return request.post('/tenant/update', params)
    }

    tenantStatusList(): Promise<iResponse> {
      return request.get('/tenant/status/list')
    }

    // 部门函数
    departmentList(params: {
      page: number
      pageSize: number
      keywords?: string
    }): Promise<iResponse> {
      return request.get('/department/list', {params})
    }

    departmentAll(): Promise<iResponse> {
      return request.get('/department/list')
    }

    departmentAdd(params: DepartmentAddParams): Promise<iResponse> {
      return request.post('/department/add', params)
    }

    departmentDelete(params: {id: number}): Promise<iResponse> {
      return request.post('/department/delete', params)
    }

    departmentEdit(params: DepartmentAddParams): Promise<iResponse> {
      return request.post('/department/update', params)
    }

    // 角色函数
    roleAll(): Promise<iResponse> {
      return request.get('/role/list')
    }

    // menu函数
    menuList(): Promise<iResponse> {
      return request.get('/menu/list')
    }
  })()
