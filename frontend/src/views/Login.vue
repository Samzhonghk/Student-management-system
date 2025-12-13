<template>
  <div class="login-page">
    <div class="login-bg" />
    <div class="login-wrap">
      <div class="login-card">
        <img :src="logoUrl" alt="logo" class="logo" />
        <h2 class="title">学生管理系统</h2>

        <el-form role="form" aria-labelledby="loginTitle" :model="form" @submit.prevent="onSubmit" :rules="rules" ref="loginForm" size="large" class="login-form">
          <el-form-item prop="username">
            <el-input ref="usernameRef" v-model="form.username" placeholder="用户名" prefix-icon="el-icon-user" aria-label="用户名" aria-required="true" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input type="password" v-model="form.password" placeholder="密码" prefix-icon="el-icon-lock" @keyup.enter="onSubmit" aria-label="密码" aria-required="true" />
          </el-form-item>

          <el-form-item class="tools">
            <el-checkbox v-model="remember">记住我</el-checkbox>
            <a class="forgot" @click.prevent="onForgot">忘记密码？</a>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="loading" class="full" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>

        <div class="meta">没有账号？联系管理员注册</div>
        <div aria-live="polite" class="sr-only" id="loginA11yHint">登录表单，使用 Tab 键在字段间切换，按 Enter 提交。</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import logoUrl from '../assets/logo.svg'
import api from '../services/api'
import { ElMessage } from 'element-plus'

const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const loginForm = ref(null)
const usernameRef = ref(null)
const loading = ref(false)
const remember = ref(false)
const logoExists = true

onMounted(() => {
  const saved = localStorage.getItem('rememberedUser')
  if (saved) {
    try { const obj = JSON.parse(saved); form.username = obj.username || ''; remember.value = true } catch (e) {}
  }
  // focus the username input for keyboard users
  nextTick(() => {
    try { usernameRef.value?.focus?.() } catch (e) {}
  })
})

async function onSubmit() {
  try {
    await loginForm.value.validate()
    loading.value = true
    const res = await api.post('/api/login', { username: form.username, password: form.password })
    localStorage.setItem('token', res.data.token)
    if (remember.value) {
      localStorage.setItem('rememberedUser', JSON.stringify({ username: form.username }))
    } else {
      localStorage.removeItem('rememberedUser')
    }
    ElMessage.success('登录成功')
    window.location.href = '/students'
  } catch (err) {
    ElMessage.error(err?.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}

function onForgot() {
  ElMessage.info('请联系管理员重置密码')
}
</script>

<style scoped>
.login-page { position:relative; min-height:100vh; font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial; }
.login-bg { position:absolute; inset:0; background: linear-gradient(135deg,#4f46e5 0%, #06b6d4 100%); filter:contrast(1.05); }
.login-wrap { position:relative; display:flex; align-items:center; justify-content:center; min-height:100vh; }
.login-card { width: 380px; background: rgba(255,255,255,0.98); border-radius:12px; box-shadow: 0 10px 30px rgba(2,6,23,0.3); padding:28px; text-align:center; transform-origin:center; animation: fadeUp 420ms cubic-bezier(.2,.9,.2,1) both; }
.logo { width:72px; height:72px; object-fit:cover; border-radius:8px; margin:0 auto 12px; display:block }
.title { margin:0 0 8px; font-size:20px; color:#111827 }
.login-form { margin-top:6px; }
.tools { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }
.forgot { font-size:13px; color:#6b7280; cursor:pointer }
.full { width:100% }
.meta { margin-top:12px; font-size:13px; color:#6b7280 }

/* accessible visually-hidden */
.sr-only { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

/* animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px) scale(.995); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* button press effect and focus styles */
.el-button.full { transition: transform 120ms ease, box-shadow 120ms ease; }
.el-button.full:active { transform: translateY(1px) scale(0.995); }
.el-button.full:focus-visible { box-shadow: 0 6px 20px rgba(99,102,241,0.12); outline: none; }

.login-card:focus-within { box-shadow: 0 14px 40px rgba(2,6,23,0.35); }

@media (max-width:420px){
  .login-card { width:92%; padding:18px }
}
</style>
