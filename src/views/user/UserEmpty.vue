<template>
  <div class="user_index_title">
    <h3>{{ $t('views.userCenter.empty.noPrivilege') }}</h3>
    <router-view></router-view>
  </div>
</template>

<style scoped>
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
</style>