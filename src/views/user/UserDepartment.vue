<template>
  <main class="container manage-container">

    <!-- 新增按钮 搜索框 -->
    <div class="select-warp flex-row-space-between">
      <div class="flex-column-center">
        <el-button type="text" class="add-button" @click="addDialogShow">
          <i class="iconfont">&#xe6ad;</i>
          <span>{{ $t('views.userCenter.department.addDepartment') }}</span>
        </el-button>
      </div>
      <div class="flex-column-center">
        <el-input
          v-model="keywords"
          :placeholder="$t('views.userCenter.department.namePlaceholder')"
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
        <el-table-column :label="$t('views.userCenter.department.name')" prop="name"></el-table-column>
        <el-table-column :label="$t('views.userCenter.department.parentName')" prop="parent" ></el-table-column>
        <el-table-column :label="$t('views.userCenter.tenant.name')" prop="tenant" ></el-table-column>
        <el-table-column :label="$t('views.userCenter.department.userCount')" prop="user_count" >
          <template #default="scope">
            <el-tooltip :content="getUserTooltip(scope.row.users)" placement="top">
              <span>{{ scope.row.user_count }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('views.operate')" width="100px">
          <template #default="{ row }">
            <div class="btn-list">
              <el-button type="text" @click="departmentEdit(row)">{{ $t('views.modify') }}</el-button>
              <el-button type="text" @click="departmentDelete(row.id)">{{ $t('views.delete') }}</el-button>
            </div>
            <!-- <i class="iconfont iconshezhi-2 pIcon" @click="departmentEdit(row)"></i>
            <span class="l"></span>
            <i class="iconfont iconshanchu-6 pIcon" @click="departmentDelete(row.id)"></i> -->
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
      :title="$t('views.userCenter.department.addDepartment')"
    >
      <el-form
        ref="ruleForm"
        label-width="150px"
        :model="departmentForm"
        status-icon
        :rules="rules"
      >
        <el-form-item :label="$t('views.userCenter.department.name')" prop="name">
          <el-input
            v-model="departmentForm.name"
            :placeholder="$t('views.userCenter.department.namePlaceholder')"
            clearable
            class="addUserInput"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.userCenter.tenant.name')">
          <el-select
            v-model="departmentForm.tenant_id"
            class="addUserInput"
            filterable
            :placeholder="$t('views.userCenter.tenant.namePlaceholder')"
            style="width: 400px"
          >
            <el-option
              v-for="item in this.tenants"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('views.userCenter.department.parentName')">
          <el-select
            v-model="departmentForm.parent_id"
            class="addUserInput"
            filterable
            :placeholder="$t('views.userCenter.department.namePlaceholder')"
            clearable
            style="width: 400px"
          >
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="text" class="submitBtn" @click="departmentAdd">{{ $t('views.confirm') }}</el-button>
          <el-button type="text" class="cancelBtn" @click="cancelAdd">{{ $t('views.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { DepartmentListObj, DepartmentAddParams, TenantListObj } from './types'
import { Form } from 'element-ui'

@Component({ name: 'UserDepartment' })
export default class UserDepartment extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private keywords = ''
  private tenants: Array<TenantListObj> = []
  private tableData: Array<DepartmentListObj> = []
  private addDialogOpen = false
  private departmentForm: DepartmentAddParams = {
    name: '',
  }

  private rules = {
    name: [
      {
        required: true,
        message: this.$t('views.userCenter.department.namePlaceholder'),
        trigger: 'blur',
      },
    ],
  }

  created() {
    this.tenantList()
    this.getTableData()
  }

  private addDialogShow() {
    this.departmentForm = {
      name: '',
      // tenant_id: this.$store.getters.userInfo.tenant_id
    }
    this.addDialogOpen = true
  }

  private departmentEdit(row: DepartmentListObj) {
    this.departmentForm = {
      name: row.name,
      id: row.id,
      tenant_id: row.tenant_id,
    }
    if (row.parent_id) {
      this.departmentForm.parent_id = row.parent_id
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
    const { status, msg, data, page } = await this.services.user.departmentList(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.tableData = data
    this.total = page.alltotal
  }

  private async tenantList() {
    this.loadingStart()
    const { status, msg, data } = await this.services.user.tenantAll()
    this.loadingDone()
    if (status === 201) {
      this.tenants= data
    }
  }

  private departmentAdd() {
    ;(this.$refs.ruleForm as Form).validate(async (valid: any) => {
      if (valid) {
        const params: DepartmentAddParams = {
          name: this.departmentForm.name,
        }
        if (this.departmentForm.tenant_id) {
          params.tenant_id = this.departmentForm.tenant_id
        }
        if (this.departmentForm.parent_id) {
          params.parent_id = this.departmentForm.parent_id
        }
        let ok: boolean = false
        this.loadingStart()
        if (this.departmentForm.id) {
          params.id = this.departmentForm.id
          const { status, msg } = await this.services.user.departmentEdit(params)
          ok = this.handleReply(status, msg)
        } else {
          const { status, msg } = await this.services.user.departmentAdd(params)
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

  private async departmentDelete(id: number) {
    this.$confirm(this.$t('views.userCenter.department.deleteConfirm') as string, '', {
      confirmButtonText: this.$t('views.delete') as string,
      cancelButtonText: this.$t('views.cancel') as string,
      type: 'warning',
    }).then(async () => {
      this.loadingStart()
      const { status, msg } = await this.services.user.departmentDelete({ id })
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
      return this.$t('views.userCenter.department.noUsers') as string
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
