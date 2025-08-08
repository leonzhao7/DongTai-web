export interface UserListObj {
  id: number
  name: string
  email: string
  phone: string
  role: string
  role_id: number
  tenant: string
  tenant_id: number
  deleted: number
  department: string
  department_id: number
}

export interface UserAddParams {
  name?: string
  email?: string
  role?: number
  tenant?: number
  department?: number
  phone?: string
  id?: number
}

export interface DepartmentListObj {
  id: number
  name: string
  parent: string
  parent_id: number
  tenant: string
  tenant_id: number
  user_count: number
  users: string[]
}

export interface DepartmentAddParams {
  id?: number
  name?: string
  parent_id?: number
  tenant_id?: number
}

export interface TenantListObj {
  id: number
  name: string
  status: number
  status_name: string
  user_count: number
  users: string[]
  department_count: number
  departments: string[]
}

export interface TenantStatusListObj {
  code: number
  name: string
}

export interface TenantAddParams {
  id?: number
  name?: string
  status?: number
}

export interface MenuListObj {
  id: number
  label: string
  url: string
}

export interface RoleListObj {
  id: number
  name: string
}