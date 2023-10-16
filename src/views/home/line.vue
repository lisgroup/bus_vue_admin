<template>
  <div>
    <nav-bar />
    <fieldSet />

    <el-input
      v-model="input"
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
    <el-table v-loading="loading" :data="tableLine" border style="width: 100%">
      <el-table-column prop="stationnum" label="编号" width="100" />
      <el-table-column prop="stationname" label="站台" width="" />
      <el-table-column label="进站时间" width="">
        <template slot-scope="scope">
          <div v-for="item in scope.row.stationdetail" :key="item">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column prop="" label="车牌" width="" />-->
    </el-table>

    <float-button
      :text="Flush"
      :font-size="16"
      @onFloatBtnClicked="handleReload()"
    />
    <Footer />
  </div>
</template>

<script>
import fieldSet from '../../components/common/fieldSet'
import FloatButton from '../../components/FloatButton'
import { Footer } from '../../layout/components'
import { line } from '@/api/bus'

export default {
  name: 'Lines',
  components: {
    fieldSet,
    FloatButton,
    Footer
  },
  data() {
    return {
      loading: false,
      isShow: false,
      input: '',
      to: '',
      href: '',
      tableData: [],
      tableLine: [],
      Flush: '刷新'
    }
  },
  created() {
    this.href = this.$route.query
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
      const line = this.input
      if (!line) {
        this.$message({
          message: '线路名称不能为空',
          type: 'warning'
        })
        return false
      }
      this.$router.push({ name: 'bus', query: { linename: line }})
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
