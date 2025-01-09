<template>

  <pagehead/>
  <menubar/>

  <div class="page-content">
    <div class="box">
    <tr class="title">菜單總表</tr>
    </div>
    <table id="data">
    <tr>
      <th> id </th>
      <th> 姓名 </th>
      <th> 價格 </th>
      <th> 評分 </th>
      <th> 餐廳 </th>
    </tr>
  </table>
  </div>
</template>

<style>
</style>

<script>

import { onMounted } from 'vue';
import './Table.css';
import pagehead from '@/components/pageHead.vue';
import menubar from "@/components/MenuBar.vue";

export default {
  components: {
    pagehead,
    menubar
  },
  setup() {
    onMounted(() => {
      fetch('http://localhost:8060/api/menu')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetched data:', data); // 添加這行
            if (Array.isArray(data)) {
              data.forEach(customer => {
                const table = document.getElementById('data');
                const row = table.insertRow();
                row.insertCell().textContent = customer.id;
                row.insertCell().textContent = customer.name;
                row.insertCell().textContent = customer.cost;
                row.insertCell().textContent = customer.score;
                row.insertCell().textContent = customer.f_restaurant_id;
              });
            } else {
              console.error('Data is not an array:', data);
            }
          })
          .catch(error => console.error('Fetch error:', error));
    });
  }
}



</script>