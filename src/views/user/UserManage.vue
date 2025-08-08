<template>
  <main class="container manage-container">

    <!-- 新增按钮 搜索框 -->
    <div class="select-warp flex-row-space-between">
      <div class="flex-column-center">
        <el-button type="text" class="add-button" @click="addDialogShow">
          <i class="iconfont">&#xe6ad;</i>
          <span>{{ $t('views.userCenter.manage.addUser') }}</span>
        </el-button>
      </div>
      <div class="flex-column-center">
        <el-input
          v-model="keywords"
          :placeholder="$t('views.userCenter.manage.namePlaceholder')"
          style="width: 360px"
          size="small"
          @keyup.enter.native="newSelectData"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="newSelectData" />
        </el-input>
      </div>
    </div>

    <!-- 列表区 -->
    <div class="list-warp">
      <el-table class="list-table" :data="tableData">
        <el-table-column :label="$t('views.userCenter.manage.name')" prop="name"></el-table-column>
        <el-table-column :label="$t('views.userCenter.manage.email')" prop="email"></el-table-column>
        <el-table-column :label="$t('views.userCenter.manage.phone')" prop="phone"></el-table-column>
        <el-table-column :label="$t('views.userCenter.manage.role')" prop="role"></el-table-column>
        <el-table-column :label="$t('views.userCenter.tenant.name')" prop="tenant"></el-table-column>
        <el-table-column :label="$t('views.userCenter.department.name')" prop="department"></el-table-column>
        <el-table-column :label="$t('views.operate')" width="100px">
          <template #default="{ row }">
            <i class="iconfont iconshezhi-2 pIcon" @click="userEdit(row)"></i>
            <span class="l"></span>
            <i class="iconfont iconshanchu-6 pIcon" @click="userDelete(row.id)"></i>
            <span class="l"></span>
            <i class="iconfont iconzhongzhimima pIcon" @click="userReset(row.id)"></i>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <div class="pagination">
        <el-pagination
          style="text-align: right; margin-top: 10px"
          layout="total, prev, pager, next, jumper"
          :hide-on-single-page="total > pageSize"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 新增/修改对话框 -->
    <el-dialog
      :visible.sync="addDialogOpen"
      top="8vh"
      :title="$t('views.userCenter.manage.addUser')"
    >
      <el-form
        ref="ruleForm"
        label-width="150px"
        :model="userForm"
        status-icon
        :rules="rules"
      >
        <el-form-item :label="$t('views.userCenter.manage.name')" prop="name">
          <el-input
            v-model="userForm.name"
            :placeholder="$t('views.userCenter.manage.namePlaceholder')"
            clearable
            class="addUserInput"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.userCenter.manage.email')" prop="email">
          <el-input
            v-model="userForm.email"
            clearable
            class="addUserInput"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.userCenter.manage.phone')" prop="phone">
          <el-input
            v-model="userForm.phone"
            clearable
            class="addUserInput"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.userCenter.tenant.name')">
          <el-select
            v-model="userForm.tenant"
            class="addUserInput"
            filterable
            allow-create
            :placeholder="$t('views.userCenter.tenant.namePlaceholder')"
            clearable
            style="width: 400px"
          >
            <el-option
              v-for="item in tenants"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('views.userCenter.department.name')">
          <el-select
            v-model="userForm.department"
            class="addUserInput"
            filterable
            allow-create
            :placeholder="$t('views.userCenter.department.namePlaceholder')"
            clearable
            style="width: 400px"
          >
            <el-option
              v-for="item in departments"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('views.userCenter.manage.role')">
          <el-select
            v-model="userForm.role"
            class="addUserInput"
            filterable
            style="width: 400px"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="text" class="submitBtn" @click="userAdd">{{ $t('views.confirm') }}</el-button>
          <el-button type="text" class="cancelBtn" @click="cancelAdd">{{ $t('views.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { UserListObj, UserAddParams, TenantListObj, RoleListObj, DepartmentListObj } from './types'
import { Form } from 'element-ui'

@Component({ name: 'UserManage' })
export default class UserDepartment extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private keywords = ''
  private tenants: Array<TenantListObj> = []
  private departments: Array<DepartmentListObj> = []
  private roles: Array<RoleListObj> = []
  private tableData: Array<UserListObj> = []
  private addDialogOpen = false
  private userForm: UserAddParams = {
    name: '',
  }

  private rules = {
    name: [
      {
        required: true,
        message: this.$t('views.userCenter.manage.namePlaceholder'),
        trigger: 'blur',
      },
    ],
  }

  created() {
    this.tenantAll()
    this.departmentAll()
    this.roleAll()
    this.getTableData()
  }

  private addDialogShow() {
    this.userForm = {
      name: '',
    }
    this.addDialogOpen = true
  }

  private userEdit(row: UserListObj) {
    this.userForm = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role_id,
    }
    if (row.department_id) {
      this.userForm.department = row.department_id
    }
    if (row.tenant_id) {
      this.userForm.tenant = row.tenant_id
    }
    this.addDialogOpen = true
  }

  private cancelAdd() {
    this.addDialogOpen = false
  }

  private newSelectData() {
    this.page = 1
    this.getTableData()
  }

  private currentChange(val: number) {
    this.page = val
    this.getTableData()
  }

  private async getTableData() {
    const params: {
      page: number
      pageSize: number
      keyword: string
    } = {
      page: this.page,
      pageSize: this.pageSize,
      keyword: this.keywords,
    }
    this.loadingStart()
    const { status, msg, data, page } = await this.services.user.userList(params)
    this.loadingDone()
    if (!this.handleReply(status, msg)) {
      return
    }
    this.tableData = data
    this.total = page.alltotal
  }

  private async tenantAll() {
    this.loadingStart()
    const { status, msg, data } = await this.services.user.tenantAll()
    this.loadingDone()
    if (!this.handleReply(status, msg)) {
      return
    }
    this.tenants = data
  }

  private async departmentAll() {
    this.loadingStart()
    const { status, msg, data } = await this.services.user.departmentAll()
    this.loadingDone()
    if (!this.handleReply(status, msg)) {
      return
    }
    this.departments = data
  }

  private async roleAll() {
    this.loadingStart()
    const { status, msg, data } = await this.services.user.roleAll()
    this.loadingDone()
    if (!this.handleReply(status, msg)) {
      return
    }
    this.roles = data
  }

  private userAdd() {
    ;(this.$refs.ruleForm as Form).validate(async (valid: any) => {
      if (valid) {
        const params: UserAddParams = {
          name: this.userForm.name,
          email: this.userForm.email,
          phone: this.userForm.phone,
        }
        if (this.userForm.role) {
          params.role = this.userForm.role
        }
        if (this.userForm.tenant) {
          params.tenant = this.userForm.tenant
        }
        if (this.userForm.department) {
          params.department = this.userForm.department
        }
        let error: boolean = false
        this.loadingStart()
        if (this.userForm.id) {
          params.id = this.userForm.id
          const { status, msg } = await this.services.user.userEdit(params)
          error = this.handleReply(status, msg)
        } else {
          const { status, msg } = await this.services.user.userAdd(params)
          error = this.handleReply(status, msg)
        }
        this.loadingDone()
        if (!error) {
          return
        }
        this.addDialogOpen = false
        this.getTableData()
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private async userDelete(id: number) {
    this.$confirm(this.$t('views.userCenter.manage.deleteConfirm') as string, '', {
      confirmButtonText: this.$t('views.delete') as string,
      cancelButtonText: this.$t('views.cancel') as string,
      type: 'warning',
    }).then(async () => {
      this.loadingStart()
      const { status, msg } = await this.services.user.userDelete({ id })
      this.loadingDone()
      if (!this.handleReply(status, msg)) {
        return
      }
      this.$message({
        type: 'success',
        message: this.$t('views.deleteSuccess') as string,
        showClose: true,
      })
      await this.getTableData()
    })
  }

  private async userLock(id: number) {
    this.loadingStart()
    const { status, msg } = await this.services.user.userLock({id})
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    await this.getTableData()
  }

  private async userReset(id: number) {
    this.$confirm(this.$t('views.userCenter.manage.resetPasswdConfirm') as string, '', {
      confirmButtonText: this.$t('views.reset') as string,
      cancelButtonText: this.$t('views.cancel') as string,
      type: 'warning',
    }).then(async () => {
      this.loadingStart()
      const { status, msg } = await this.services.user.userReset({ id })
      this.loadingDone()
      if (!this.handleReply(status, msg)) {
        return
      }
      this.$message({
        type: 'success',
        message: this.$t('views.resetSuccess') as string,
        showClose: true,
      })
      await this.getTableData()
    })
  }
}
</script>

<style scoped lang="scss">
.list-warp {
  width: 100%;
  background: #fff;
  min-height: calc(100vh - 153px);
}

.submitBtn {
  width: 124px;
  height: 38px;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
  font-size: 14px;
}

.cancelBtn {
  width: 124px;
  height: 38px;
  border-radius: 2px;
  border: 1px solid #4a72ae;
  font-size: 14px;
  color: #4a72ae;
}
</style>
