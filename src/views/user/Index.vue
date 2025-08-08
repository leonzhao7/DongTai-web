<template>
   <div class="page_user_index">
    <div class="user_index_title">
      <p v-for="item in menuList" @click="next(item)" :class="{act: cur === item.id}">{{ item.label }}</p>
    </div>
    <router-view></router-view>
   </div>
</template>

<script lang="ts">
import VueBase, { RoleLevel } from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { MenuListObj } from './types'

@Component({ name: 'UserIndex' })
export default class UserIndex extends VueBase {
  private menuList: Array<MenuListObj> = []
  private cur = 0

  created() {
    this.getMenuList()
  }

  private async getMenuList() {
    // this.loadingStart()
    // const { status, msg, data } = await this.services.user.menuList()
    // this.loadingDone()
    // if (status !== 201) {
    //   this.$message({
    //     type: 'error',
    //     message: msg,
    //     showClose: true,
    //   })
    //   return
    // }
    // this.menuList= data
    switch (this.$store.getters.userInfo.role) {
      case RoleLevel.SUPER_ADMIN:
        this.menuList = [
          {id: 0, label: "公司管理", url: "/userCenter/tenant"},
          {id: 1, label: "部门管理", url: "/userCenter/department"},
          {id: 2, label: "用户管理", url: "/userCenter/manage"},
        ]
        break
      case RoleLevel.TENANT_ADMIN:
        this.menuList = [
          {id: 1, label: "部门管理", url: "/userCenter/department"},
          {id: 2, label: "用户管理", url: "/userCenter/manage"},
        ]
        break
    }
    
    if (this.menuList.length == 0) {
      this.$router.push('/userCenter/empty')
    } else {
      this.next(this.menuList[0])
    }
  }

  private next(item: any) {
    this.cur = item.id
    this.$router.push(item.url)
  }
}
</script>

<style scoped lang="scss">
.page_user_index {
}

.user_index_title{
  margin: 20px auto;
  height: 30px;
  line-height: 40px;
  width: 360px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.act {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}
</style>
