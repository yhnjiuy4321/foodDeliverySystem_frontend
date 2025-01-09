

<template>

  <nav class="navbar navbar-expand-sm navbar-dark bg-dark p-0 mb-3">
    <div class="container-fluid ">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mynavbar">
        <ul class="navbar-nav me-auto ">
          <li class="nav-item ">
            <router-link to="/order" class="nav-link" active-class="active">訂單</router-link>
          </li>
          <li class="nav-item ">
            <router-link to="/customer" class="nav-link ">顧客</router-link>
          </li>
          <li class="nav-item ">
            <router-link to="/restaurant" class="nav-link ">餐廳</router-link>
          </li>
          <li class="nav-item ">
            <router-link to="/driver" class="nav-link ">外送員</router-link>
          </li>
          <li class="nav-item ">
            <router-link to="/menu" class="nav-link ">菜單</router-link>
          </li>
        </ul>
      </div>
      <div class="d-flex justify-content-end">
        <div class="whoLogin justify-content-center d-flex">
          <i class="fas fa-user-circle m-2"></i>
          <span>{{getStaffName.name}}</span>
        </div>
      <button class="btn_logout" @click="leave" data-bs-toggle="tooltip" title="登出"><i class="fas fa-sign-out-alt"></i></button>
    </div>
    </div>
  </nav>



</template>

<script setup>
  import { logout,getStaffName } from "@/auth.js" //引入登出功能


  //登出功能
  const leave = () => {
    if(confirm('確定要登出嗎?')){
      logout();
    }
  }


</script>

<style>
  .navbar {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #333;
    color: white;
    text-align: center;
    padding: 10px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
  }

  .nav-link {
    color: white;
    cursor: pointer;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }

  .nav-link:hover {
    background: #f2f2f2;
    color: #137544;
  }

  .btn_logout {
    background-color: rgba(0, 0, 0, 0);
    color: #ffffff;
    border: none;
    margin: 3px;
    font-size: 20px;
    cursor: pointer;
  }

  .btn_logout:hover {
    color: #ffd500;
  }

  .whoLogin {
    align-items: center;
    margin-right: 20px;
    color: white;
  }

</style>