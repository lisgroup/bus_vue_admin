<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
    <el-form-item label="执行周期" prop="cycle">
      <!--<el-button>执行周期</el-button>-->
      <el-row class="demo-autocomplete">
        <el-col :span="20">
          <el-select v-model="ruleForm.cycle" placeholder="选择周期" @change="handleSelectChange">
            <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
          <el-input-number v-show="showHour" v-model="ruleForm.hour" :max="23" :min="0" label="小时" @change="handleHour" />
          <span v-show="showHour">小时</span>
          <el-input-number v-show="showMinute" v-model="ruleForm.minute" :max="59" :min="0" label="分钟" @change="handleMinute" />
          <span v-show="showMinute">分钟</span>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="Server酱Key" prop="key">
      <el-row class="demo-autocomplete">
        <el-col :span="10">
          <el-input
            v-model="ruleForm.key"
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
export default {
  data() {
    return {
      showHour: true,
      showMinute: true,
      ruleForm: {
        cycle: 'day',
        hour: 1,
        minute: 30,
        key: ''
      },
      options: [
        { value: 'day', label: '每天' },
        { value: 'hour', label: '每小时' },
        { value: 'hour-n', label: 'N小时' },
        { value: 'month', label: '工作日' }
      ],
      rules: {
        cycle: [
          { required: true, message: '请选择执行周期', trigger: 'blur' }
        ],
        hour: [
          { required: true, message: '请输入小时', trigger: 'change' },
          { min: 0, max: 23, message: '请输入小时', trigger: 'blur' }
        ],
        minute: [
          { required: true, message: '请输入分钟', trigger: 'change' },
          { min: 0, max: 59, message: '请输入分钟', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入Server酱Key', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
      console.log('Selected Value:', value)
    },
    handleHour(value) {
      console.log(value)
    },
    handleMinute(value) {
      console.log(value)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
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
