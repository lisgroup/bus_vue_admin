<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
    <el-form-item label="执行周期" prop="cycle">
      <!--<el-button>执行周期</el-button>-->
      <el-row class="demo-autocomplete">
        <el-col :span="20">
          <el-select v-model="ruleForm.cycle" placeholder="选择周期" @change="handleSelectChange">
            <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
          <!--          <el-input-number v-show="showHour" v-model="ruleForm.hour" :max="23" :min="0" label="小时" @change="handleHour" />-->
          <!--          <span v-show="showHour">小时</span>-->
          <!--          <el-input-number v-show="showMinute" v-model="ruleForm.minute" :max="59" :min="0" label="分钟" @change="handleMinute" />-->
          <!--          <span v-show="showMinute">分钟</span>-->
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="开始时间" prop="start_time">
      <el-row class="demo-autocomplete">
        <el-col :span="10">
          <el-form-item prop="start_time">
            <el-time-picker v-model="ruleForm.start_time" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="结束时间" prop="end_time">
      <el-row class="demo-autocomplete">
        <el-col :span="10">
          <el-form-item prop="end_time">
            <el-time-picker v-model="ruleForm.end_time" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="Server酱Key" prop="j_key">
      <el-row class="demo-autocomplete">
        <el-col :span="10">
          <el-input
            v-model="ruleForm.j_key"
            class="inline-input"
            placeholder="请输入Server酱Key"
            :trigger-on-focus="false"
          />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { edit } from '@/api/notice'

export default {
  data() {
    return {
      showHour: true,
      showMinute: true,
      ruleForm: {
        id: 0,
        cycle: 'day', // day=每天，one=一次 hour=每小时
        hour: 1,
        minute: 30,
        j_key: '',
        start_time: '',
        ent_time: '',
        line_id: '',
        line_name: '',
        line_from_to: '',
        station_num: '',
        station_id: '',
        station_name: '',
        notice_time: 1
      },
      options: [
        { value: 'day', label: '每天' },
        { value: 'one', label: '一次' }
        // { value: 'hour', label: '每小时' },
        // { value: 'hour-n', label: 'N小时' },
        // { value: 'weekday', label: '工作日' }
      ],
      rules: {
        cycle: [
          { required: true, message: '请选择执行周期', trigger: 'blur' }
        ],
        // hour: [
        //   { required: true, message: '请输入小时', trigger: 'change' },
        //   { min: 0, max: 23, message: '请输入小时', trigger: 'blur' }
        // ],
        // minute: [
        //   { required: true, message: '请输入分钟', trigger: 'change' },
        //   { min: 0, max: 59, message: '请输入分钟', trigger: 'blur' }
        // ],
        start_time: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        end_time: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        j_key: [
          { required: true, message: '请输入Server酱Key', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.ruleForm.id = this.$route.params.id
    this.getTaskData(this.id)
    // 字符串转时间
    this.ruleForm.start_time = this.changeTime(this.ruleForm.start_time)
    this.ruleForm.ent_time = this.changeTime(this.ruleForm.ent_time)
    console.log(this.ruleForm.start_time, this.ruleForm.ent_time)
  },
  methods: {
    changeTime(time) {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = time.split(':')[0];
      const minutes = time.split(':')[1];
      return new Date(year, month, day, hour, minutes);
    },
    getTaskData(id) {
      // this.id = this.$route.params.id
      edit(id).then(response => {
        console.log(response)
        this.loading = false
        if (response.code === 200) {
          console.log(response.data)
          this.ruleForm = response.data
          console.log(this.ruleForm)
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleSelectChange(value) {
      if (value === 'hour') {
        this.showHour = false
        this.showMinute = true
      } else if (value === 'day') {
        this.showHour = true
        this.showMinute = true
      } else if (value === 'month') {
        this.showHour = true
        this.showMinute = true
      } else if (value === 'hour-n') {
        this.showHour = true
        this.showMinute = false
      } else {
        this.showHour = true
        this.showMinute = true
      }
      // console.log('Selected Value:', value)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.ruleForm.line_id = this.rowData.lineid
          // this.ruleForm.line_name = this.rowData.linename
          // this.ruleForm.station_num = this.rowData.stationnum
          // this.ruleForm.station_id = this.rowData.stationid
          // this.ruleForm.station_name = this.rowData.stationname
          // this.ruleForm.line_from_to = this.rowData.lineFromTo
          console.log(this.ruleForm)
          // postAdd(this.ruleForm).then(res => {
          //   // 弹窗成功，并关闭窗口
          //   this.$message({
          //     message: '通知任务保存成功',
          //     type: 'success'
          //   })
          //   // 触发自定义事件，通知index.vue关闭弹窗
          //   this.$emit('close-dialog')
          // }).catch(err => {
          //   return err
          // })
          setTimeout(() => {
            this.loading = false
          }, 500)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
</style>
