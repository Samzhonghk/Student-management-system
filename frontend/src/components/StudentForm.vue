<template>
  <el-form :model="local" :rules="rules" ref="formRef" label-width="90px">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="local.name" />
    </el-form-item>
    <el-form-item label="学号" prop="student_id">
      <el-input v-model="local.student_id" />
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="local.gender">
        <el-radio label="male">男</el-radio>
        <el-radio label="female">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input-number v-model="local.age" :min="0" />
    </el-form-item>
    <el-form-item label="班级" prop="class">
      <el-input v-model="local.class" />
    </el-form-item>
    <el-form-item label="联系电话" prop="phone">
      <el-input v-model="local.phone" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import api from '../services/api'
import { ElMessage } from 'element-plus'

const props = defineProps({ modelValue: Object })
const emit = defineEmits(['save','cancel'])

const local = reactive({
  id: null,
  name: '',
  student_id: '',
  gender: 'male',
  age: null,
  class: '',
  phone: ''
})

watch(() => props.modelValue, v => {
  if (v && Object.keys(v).length) {
    Object.assign(local, v)
  } else {
    // reset local fields when modelValue is empty
    local.id = null
    local.name = ''
    local.student_id = ''
    local.gender = 'male'
    local.age = null
    local.class = ''
    local.phone = ''
  }
}, { immediate: true, deep: true })

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  student_id: [{ required: true, message: '请输入学号', trigger: 'blur' }]
}

const formRef = ref(null)

async function onSave() {
  try {
    await formRef.value.validate()
    if (local.id) {
      await api.put(`/api/students/${local.id}`, local)
    } else {
      await api.post('/api/students', local)
    }
    ElMessage.success('保存成功')
    emit('save')
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '保存失败')
  }
}

function onCancel() {
  emit('cancel')
}
</script>
