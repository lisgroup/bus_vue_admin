<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="medium">
        <router-link to="lines/add">新增</router-link>
      </el-button>
    </el-row>

    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="输入搜索关键词" prop="input">
        <el-input v-model="form.input" placeholder="例如:线路名称，站台名称" @keyup.enter.native="goSearch('form')">
          <template slot="prepend">关键词</template>
          <el-button slot="append" icon="el-icon-search" @click="goSearch('form')">搜索</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="70">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="通知key">
        <template slot-scope="scope">
          {{ scope.row.j_key }}
        </template>
      </el-table-column>
      <el-table-column label="执行周期" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.cycle === 'day'">每天</span>
          <span v-else-if="scope.row.cycle === 'one'">一次</span>
          <span v-else-if="scope.row.cycle === 'hour'">每小时</span>
          <!--<span>{{ scope.row.cycle }}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="线路名称：方向" width="280" align="center">
        <template slot-scope="scope">
          {{ scope.row.line_name }}：{{ scope.row.line_from_to }}
        </template>
      </el-table-column>
      <el-table-column label="站台名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.station_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="start_time" label="开始时间" width="100">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="end_time" label="结束时间" width="100">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提醒次数" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.notice_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
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
import {deleteAct, getList} from '@/api/notice'

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
      total: 1000,
      currentpage: 1,
      listQuery: {page: 1},
      form: {
        input: ''
      },
      rules: {
        input: [
          {required: true, message: '请输入搜索关键词', trigger: 'blur'}
        ]
      }
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
    fetchData() {
      this.listLoading = true
      const params = Object.assign({'page': this.listQuery.page}, {'page_size': this.perpage})
      getList(params).then(response => {
        console.log(response)
        this.list = response.data.notice
        this.listLoading = false
        this.total = response.data.total
      })
    },
    handleEdit(index, row) {
      // console.log('notice/edit/' + row.id)
      this.$router.push({path: '/notice/edit/' + row.id})
      // this.$router.push({ name: 'taskEdit', params: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除操作
        deleteAct(row.id).then(response => {
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
    },
    handleSizeChange(val) {
      this.perpage = val
      this.$router.push({path: '', query: {page: this.listQuery.page, perPage: val}})
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery = {page: val}
      this.$router.push({path: '', query: {page: val, perPage: this.perpage}})
      this.fetchData({page: val})
    },
    goSearch(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.listLoading = true
          const param = {'keyword': this.form.input}
          getList(param).then(response => {
            // console.log(response)
            this.listLoading = false
            if (response.code === 200) {
              this.form.isShow = true
              // console.log(response.data)
              this.list = response.data.data
              this.total = response.data.total
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          // this.$message('error search!')
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.pagination {
  margin: 20px auto;
}
</style>
