<template>
  <div>
    <nav-bar />
    <fieldSet />

    <el-input
      v-model="lineName"
      placeholder="线路名称，例：快线1, 55"
      @keyup.enter.native="goSearch"
    >
      <template slot="prepend">线路</template>
      <el-button slot="append" icon="el-icon-search" @click="goSearch">搜索</el-button>
    </el-input>

    <fieldset
      class="layui-elem-field layui-field-title"
      style="margin-top: 20px;color:green;"
    >
      <legend>
        {{ to }}&nbsp;<button
          class="layui-btn layui-btn-normal"
          @click="handleReload()"
        >
          刷新
        </button>
      </legend>
    </fieldset>
    <div style="overflow: auto;">
      <el-table v-loading="loading" :data="tableLine" border style="width: 100%; margin-bottom: 50px">
        <el-table-column prop="stationnum" label="编号" width="100">
          <template slot-scope="scope">
            <div @click="showForm(scope.row)">
              {{ scope.row.stationnum }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stationname" label="站台" width="">
          <template slot-scope="scope">
            <div @click="showForm(scope.row)">
              {{ scope.row.stationname }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="进站时间" width="">
          <template slot-scope="scope">
            <div @click="showForm(scope.row)">
              <div v-for="item in scope.row.stationdetail" :key="item">
                {{ item }}
              </div>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column prop="" label="车牌" width="" />-->
      </el-table>
    </div>

    <float-button
      :text="Flush"
      :font-size="16"
      @onFloatBtnClicked="handleReload()"
    />
    <Footer />
    <el-dialog :visible="dialogVisible" title="微信定时通知配置" width="70%" @close="closeDialog">
      <form-component :rowData="selectedRowData" @close-dialog="closeDialog" />
    </el-dialog>
  </div>
</template>

<script>
import fieldSet from '../../components/common/fieldSet'
import FloatButton from '../../components/FloatButton'
import { Footer } from '../../layout/components'
import { line } from '@/api/bus'
import FormComponent from '@/views/home/form_crontab.vue'

export default {
  name: 'Lines',
  components: {
    fieldSet,
    FloatButton,
    Footer,
    FormComponent
  },
  data() {
    return {
      loading: false,
      isShow: false,
      lineName: '',
      to: '',
      href: '',
      tableData: [],
      tableLine: [],
      Flush: '刷新',
      dialogVisible: false,
      selectedRowData: null
    }
  },
  created() {
    this.href = this.$route.query
    this.lineName = this.href.lineName
    this.handleReload()
  },
  methods: {
    handleReload() {
      this.loading = true
      this.to = this.href.to

      const lineID = this.href.lineID
      if (!lineID) {
        this.$message({
          message: '线路选择有误',
          type: 'warning'
        })
        return false
      }

      line({ lineid: lineID }).then(res => {
        if (res.data.to) {
          this.to = res.data.to
        }
        this.tableLine = res.data.list
      }).catch(err => {
        return err
      })
      setTimeout(() => {
        this.loading = false
      }, 500)
    },

    goSearch() {
      const line = this.lineName
      if (!line) {
        this.$message({
          message: '线路名称不能为空',
          type: 'warning'
        })
        return false
      }
      this.$router.push({ name: 'bus', query: { linename: line }})
    },
    showForm(row) {
      // console.log(row)
      this.dialogVisible = true
      row.lineid = this.href.lineID
      row.linename = this.lineName
      row.lineFromTo = this.href.to
      this.selectedRowData = row
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 97%;
  margin-bottom: 3%;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
