<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 卡片 1：文章总数 -->
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-title">文章总数</div>
          <div class="card-number">{{ stats.articleCount }} <span>篇</span></div>
        </el-card>
      </el-col>

      <!-- 卡片 2：总浏览量 -->
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-title">总浏览量</div>
          <div class="card-number">{{ stats.viewCount }} <span>次</span></div>
        </el-card>
      </el-col>

      <!-- 卡片 3：评论总数 -->
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-title">评论总数</div>
          <div class="card-number">{{ stats.commentCount }} <span>条</span></div>
        </el-card>
      </el-col>

      <!-- 卡片 4：访客总数 -->
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-title">注册用户</div>
          <div class="card-number">{{ stats.userCount }} <span>人</span></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下面留个位置，以后可以放访问量折线图 -->
    <el-card shadow="hover" class="chart-card">
      <div class="card-title">近期访问趋势（开发中...）</div>
      <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">
        <el-icon size="50"><DataLine /></el-icon>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataLine } from '@element-plus/icons-vue'
import request from '@/request' // 引入你的 Axios 实例

// 定义数据的响应式对象，先给点假数据撑撑场面
const stats = ref({
  articleCount: 0,
  viewCount: 0,
  commentCount: 0,
  userCount: 0
})

// 页面加载时请求真实数据
onMounted(async () => {
  try {
    // 假设你在后端写了这个接口，用来返回统计数据
    // const res = await request.get('/dashboard/stats')
    // stats.value = res
    
    // 暂时先用假数据展示效果
    stats.value = {
      articleCount: 12,
      viewCount: 3450,
      commentCount: 88,
      userCount: 102
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.data-card {
  text-align: center;
  border-radius: 10px;
}
.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.card-number {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}
.card-number span {
  font-size: 14px;
  font-weight: normal;
  color: #999;
}
.chart-card {
  margin-top: 20px;
  border-radius: 10px;
}
</style>