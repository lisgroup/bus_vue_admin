<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="medium">
        <router-link to="/task/search">根据车次查询</router-link>
      </el-button>
      <el-button type="primary" size="medium">
        <router-link to="/task/newBus">新增任务</router-link>
      </el-button>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          <!--{{ scope.$index + 1 }}-->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="车次信息" width="300">
        <template slot-scope="scope">
          {{ scope.row.LineInfo }}
        </template>
      </el-table-column>
      <el-table-column label="cid" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="LineGuid" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.LineGuid }}
        </template>
      </el-table-column>
      <el-table-column label="开启时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.start_at }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.end_at }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="启动状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_task" type="success">启动</el-tag>
          <el-tag v-else type="warning">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :total="total"
        :current-page="currentpage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="perpage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getList, deleteTask } from '@/api/task'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'gray',
        '-1': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      perpage: 10,
      total: 100,
      currentpage: 1,
      listQuery: { page: 1 }
    }
  },
  created() {
    this.listQuery = this.$route.query
    this.currentpage = parseInt(this.listQuery.page)
    const perPage = parseInt(this.$route.query.perPage)
    this.perpage = isNaN(perPage) ? this.perpage : perPage
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.perpage = val
      this.$router.push({ path: '', query: { page: this.listQuery.page, perPage: val }})
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery = { page: val }
      this.$router.push({ path: '', query: { page: val, perPage: this.perpage }})
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const param = Object.assign({ 'page': this.listQuery.page }, { 'perPage': this.perpage })
      getList(param).then(response => {
        this.list = response.data.data
        this.total = response.data.total ? response.data.total : 0
        this.listLoading = false
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: '/task/edit/' + row.id })
      // this.$router.push({ name: 'taskEdit', params: { id: row.id }})
      // console.log(index, row)
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除操作
        deleteTask(row.id).then(response => {
          // console.log(response)
          this.loading = false
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
            // this.$router.push({ path: this.redirect || '/' })
          } else {
            this.$message.error(response.msg)
          }
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
</style>
