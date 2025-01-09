<script setup>
import PageHead from '@/components/pageHead.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from "@/auth.js"


const account = ref('')
const password = ref('')
const router = useRouter()


//登入功能
const enter = () => {
  try {
    login(account.value, password.value)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

</script>

<template>
  <PageHead class="onlyForLogin"/>

  <div class="box w-100 d-flex m-0">

  <div class="photo w-50">
    <img src="/mandan.png" alt="...">
  </div>

    <div class="loginContainer w-100 d-flex justify-content-sm-center">


      <div class="input_box d-grid">

        <h1 class="text-center">管理員登入入口</h1>

        <div class="account d-flex mt-3">



          <label class="name">帳號：</label>
          <input type="text" id="account" v-model="account" name="account" placeholder="請輸入帳號">
        </div>

        <div class="passwords d-flex">
          <div class="name">密碼：</div>
          <input type="text" id="password" v-model="password" name="password" placeholder="請輸入密碼">
        </div>

        <button class="btn  mt-3" @click="enter">登入</button>

      </div>

    </div>



  </div>

</template>

<style scoped>

.onlyForLogin{
  background-color: #000000;
  color: #ffd500;
}

.box{
  background-color: #fd443e;
  padding-top: 60px;
  height: 100vh; /* Full viewport height */
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.photo{
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 50px;

}

.photo img{
  width: 450px;
}

.input_box{
  width: 70%;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.66);
}

.name{
  width: 18%;
  text-align: right;
  display: flex;
  align-items: center;
}

.account{
  margin-bottom: 20px;
}

.passwords{
  margin-bottom: 20px;
}

input{
  width: 100%;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
}

button{
  width: 100%;
  padding: 5px;
  border-radius: 20px;
  background-color: #1fb92e;
  color: #fff;
  margin: 0 auto;
}

button:hover{
  background-color: #137544;
  color: #fff;
}

</style>