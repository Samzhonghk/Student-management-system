<template>
  <el-table :data="students" style="width:100%">
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="student_id" label="学号" />
    <el-table-column prop="class" label="班级" />
    <el-table-column prop="age" label="年龄" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button size="mini" @click="$emit('edit', row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="del(row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const props = defineProps({ students: Array })
const emit = defineEmits(['edit','delete'])

function del(id){
  emit('delete', id)
}
</script>
