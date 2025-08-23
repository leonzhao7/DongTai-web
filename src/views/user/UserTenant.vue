<template>
  <main class="container manage-container">
    
    <!-- 新增按钮 搜索框 -->
    <div class="select-warp flex-row-space-between">
      <div class="flex-column-center">
        <el-button type="text" class="add-button" @click="addDialogShow">
          <i class="iconfont">&#xe6ad;</i>
          <span>{{ $t('views.userCenter.tenant.addTenant') }}</span>
        </el-button>
      </div>
      <div class="flex-column-center">
        <el-input
          v-model="keywords"
          :placeholder="$t('views.userCenter.tenant.namePlaceholder')"
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
        <el-table-column :label="$t('views.userCenter.tenant.name')" prop="name"></el-table-column>
        <el-table-column :label="$t('views.userCenter.tenant.status')" prop="status_name"></el-table-column>
        <el-table-column :label="$t('views.userCenter.tenant.departmentCount')" prop="department_count"></el-table-column>
        <el-table-column :label="$t('views.userCenter.tenant.userCount')" prop="user_count">
          <template #default="scope">
            <el-tooltip :content="getUserTooltip(scope.row.users)" placement="top">
              <span>{{ scope.row.user_count }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('views.operate')" width="100px">
          <template #default="{ row }">
            <div class="btn-list">
              <el-button type="text" @click="tenantEdit(row)">{{ $t('views.modify') }}</el-button>
              <el-button type="text" @click="tenantDelete(row.id)">{{ $t('views.delete') }}</el-button>
            </div>
            <!-- <i class="iconfont iconshezhi-2 pIcon" @click="tenantEdit(row)"></i>
            <span class="l"></span>
            <i class="iconfont iconshanchu-6 pIcon" @click="tenantDelete(row.id)"></i> -->
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
      :title="$t('views.userCenter.tenant.addTenant')"
    >
      <el-form
        ref="ruleForm"
        label-width="150px"
        :model="tenantForm"
        status-icon
        :rules="rules"
      >
        <el-form-item :label="$t('views.userCenter.tenant.name')" prop="name">
          <el-input
            v-model="tenantForm.name"
            :placeholder="$t('views.userCenter.tenant.namePlaceholder')"
            clearable
            class="addUserInput"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.userCenter.tenant.status')">
          <el-select
            v-model="tenantForm.status"
            class="addUserInput"
            filterable
            style="width: 400px"
          >
            <el-option
              v-for="item in tenantStatus"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="text" class="submitBtn" @click="tenantAdd">{{ $t('views.confirm') }}</el-button>
          <el-button type="text" class="cancelBtn" @click="cancelAdd">{{ $t('views.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { TenantAddParams, TenantListObj, TenantStatusListObj } from './types'
import { Form } from 'element-ui'
import { Row } from 'view-design'
import { userRoutes } from '@/router/user'

@Component({ name: 'UserTenant' })
export default class UserTenant extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private keywords = ''
  private tableData: Array<TenantListObj> = []
  private tenantStatus: Array<TenantStatusListObj> = []
  private addDialogOpen = false
  private tenantForm: TenantAddParams = {}

  private rules = {
    name: [
      {
        required: true,
        message: this.$t('views.userCenter.tenant.namePlaceholder'),
        trigger: 'blur',
      },
    ],
  }

  created() {
    this.getTenantStatus()
    this.getTableData()
  }

  private addDialogShow() {
    this.tenantForm = {
      name: '',
    }
    this.addDialogOpen = true
  }

  private tenantEdit(row: TenantListObj) {
    this.tenantForm = {
      name: row.name,
      id: row.id,
      status: row.status,
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

  private async getTenantStatus() {
    this.loadingStart()
    const { status, msg, data } = await this.services.user.tenantStatusList()
    this.loadingDone()
    if (status === 201) {
      this.tenantStatus = data
    }
  }

  private getStatusName(code: number) {
    for (const item of this.tenantStatus) {
      if (item.code == code) {
        return item.name
      }
    }

    return String(code)
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
    const { status, msg, data, page } = await this.services.user.tenantList(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.tableData = []
    for (const item of data) {
      const obj: TenantListObj = {
        id: item.id,
        name: item.name,
        status: item.status,
        status_name: this.getStatusName(item.status),
        user_count: item.user_count,
        users: item.users,
        department_count: item.department_count,
        departments: item.departments,
      }
      this.tableData.push(obj)
    }
    this.total = page.alltotal
  }

  private tenantAdd() {
    ;(this.$refs.ruleForm as Form).validate(async (valid: any) => {
      if (valid) {
        const params: TenantAddParams = {
          name: this.tenantForm.name,
        }
        if (this.tenantForm.status) {
          params.status = this.tenantForm.status
        }
        let ok: boolean = false
        this.loadingStart()
        if (this.tenantForm.id) {
          params.id = this.tenantForm.id
          const { status, msg } = await this.services.user.tenantEdit(params)
          ok = this.handleReply(status, msg)
        } else {
          const { status, msg } = await this.services.user.tenantAdd(params)
          ok = this.handleReply(status, msg)
        }
        this.loadingDone()
        if (!ok) {
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

  private async tenantDelete(id: number) {
    this.$confirm(this.$t('views.userCenter.tenant.deleteConfirm') as string, '', {
      confirmButtonText: this.$t('views.delete') as string,
      cancelButtonText: this.$t('views.cancel') as string,
      type: 'warning',
    }).then(async () => {
      this.loadingStart()
      const { status, msg } = await this.services.user.tenantDelete({ id })
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

  private getUserTooltip(users: string[]): string {
    if (!users || users.length == 0) {
      return this.$t('views.userCenter.tenant.noUsers') as string
    }

    return users.join(', ');
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
