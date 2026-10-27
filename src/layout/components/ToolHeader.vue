<template>
  <div class="tool-header">
    <div class="left">
      <!-- 可以放个折叠按钮或者欢迎语 -->
      <span class="title">个人博客后台管理系统</span>
    </div>
    
    <div class="right">
      <!-- 只留一个退出登录的按钮，最实用 -->
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ username }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 从 store 里获取用户名
const username = computed(() => userStore.userInfo?.username || 'Admin')

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.clearSession()
    localStorage.clear() 
    ElMessage.success('已退出登录')
    window.location.href = '/#/login'
  }
}
</script>

<style scoped>
.tool-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--el-text-color-regular);
  font-size: 14px;
}
</style>