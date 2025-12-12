<template>
  <el-container>
    <el-header style="display:flex;justify-content:space-between;align-items:center">
      <div>学生管理系统</div>
      <el-button type="text" @click="logout">退出</el-button>
    </el-header>
    <el-main>
      <el-row style="margin-bottom:16px">
        <el-col :span="12">
          <el-input placeholder="按姓名搜索" v-model="q" @input="fetchStudents" clearable />
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" @click="onAddClick">添加学生</el-button>
        </el-col>
      </el-row>
      <student-table :students="students" @delete="onDelete" @edit="onEdit" />

      <!-- Simple inline modal fallback (replaces Element Plus dialog while troubleshooting) -->
      <div v-if="showAdd" style="position:fixed;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;z-index:3000">
        <div @click="onCancel" style="position:absolute;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.4)"></div>
        <div @click.stop style="position:relative;z-index:3001;background:#fff;border-radius:6px;padding:16px;min-width:400px;box-shadow:0 2px 12px rgba(0,0,0,0.4)">
          <h3 style="margin-top:0">添加学生</h3>
          <student-form :modelValue="editing" @save="onSave" @cancel="onCancel" />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../services/api'
import StudentForm from '../components/StudentForm.vue'
import StudentTable from '../components/StudentTable.vue'

const q = ref('')
const students = ref([])
const showAdd = ref(false)
const editing = reactive({})

async function fetchStudents() {
  const res = await api.get('/api/students', { params: { q: q.value } })
  students.value = res.data
}

function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

function onAddClick() {
  showAdd.value = true
}

function onDelete(id) {
  api.delete(`/api/students/${id}`).then(fetchStudents)
}

function onEdit(student) {
  Object.assign(editing, student)
  showAdd.value = true
}

function onSave() {
  showAdd.value = false
  Object.keys(editing).forEach(k => delete editing[k])
  fetchStudents()
}

function onCancel() {
  showAdd.value = false
}

onMounted(fetchStudents)
</script>
