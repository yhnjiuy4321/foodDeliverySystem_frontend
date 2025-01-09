<template>

  <pagehead/>
  <menubar/>

  <div class="page-content">
    <div class="box">
    <div class="title">訂單總表</div>
      <div class="tool d-flex">
        <form class="searchArea d-flex" @submit.prevent="searchOrder">
          <input class="form-control mr-sm-2" type="search" placeholder="請輸入訂單編號" aria-label="Search" v-model="searchTerm.term">
          <button class="btn btn-outline-success my-2 my-sm-0"  type="submit">Search</button>
        </form>

        <select class="form-select" @change="handleSelection">
          <option disabled selected>--篩選--</option>
          <option value="cancel">只選擇已取消</option>
          <option value="complete">只選擇已完成</option>
          <option value="pending">只選擇配送中</option>
          <option value="idAsc">依id排序(升冪)</option>
          <option value="idDesc">依id排序(降冪)</option>
          <option value="timeOtoN">依時間排序(由舊到新)</option>
          <option value="timeNtoO">依時間排序(由新到舊)</option>
        </select>

      </div>
    </div>
  <table id="data">

    <tr>
      <th> id </th>
      <th> 成立日期 </th>
      <th> 訂單狀態 </th>
      <th> 功能 </th>
    </tr>
  </table>
</div>

  <div class="modal fade" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title"></h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
        </div>
        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>


</template>

<script>

import {onMounted, ref} from 'vue';
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
      fetch('http://localhost:8060/api/order')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetched data:', data); // 添加這行
            if (Array.isArray(data)) {
              data.forEach(order => {
                const table = document.getElementById('data');
                const row = table.insertRow();
                row.insertCell().textContent = order.id;
                row.insertCell().textContent = order.time;
                row.insertCell().textContent = order.status;
                // row.insertCell().textContent = customer.totalmoney;
                // row.insertCell().textContent = customer.f_restaurant_id;
                // row.insertCell().textContent = customer.f_driver_id;
                // row.insertCell().textContent = customer.f_customer_id;

                //詳細清單功能
                const cell = row.insertCell();
                const button = document.createElement('button');
                button.textContent = '詳細資料';
                button.className = 'btn btn-primary';
                button.setAttribute('data-bs-toggle', 'modal');
                button.setAttribute('data-bs-target', '#myModal');
                button.addEventListener('click', () => {
                  document.querySelector('.modal-title').textContent = `${order.id}訂單`;
                  document.querySelector('.modal-body').innerHTML = `
                    <p>成立日期: ${order.time}</p>
                    <p>訂單狀態: ${order.status}</p>
                    <p>餐廳: ${order.f_restaurant_id}</p>
                    <p>外送員: ${order.f_driver_id}</p>
                    <p>顧客: ${order.f_customer_id}</p>
                    <p>菜單: ${order.f_dish_id}</p>
                    <p>總金額: ${order.totalmoney}</p>
                  `;
                });
                cell.appendChild(button);

              });
            } else {
              console.error('Data is not an array:', data);
            }
          })
          .catch(error => console.error('Fetch error:', error));
    });


    //搜尋提供
    const searchTerm = ref({
      term: ''
    });


    //搜尋功能
    const searchOrder =(event) => {
      const table = document.getElementById('data');
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }

      fetch(`http://localhost:8060/api/order/search?id=${encodeURIComponent(searchTerm.value.term)}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetched data:', data); // 添加這行
            if (Array.isArray(data)) {
              data.forEach(order => {
                const row = table.insertRow();
                row.insertCell().textContent = order.id;
                row.insertCell().textContent = order.time;
                row.insertCell().textContent = order.status;
                // row.insertCell().textContent = customer.totalmoney;
                // row.insertCell().textContent = customer.f_restaurant_id;
                // row.insertCell().textContent = customer.f_driver_id;
                // row.insertCell().textContent = customer.f_customer_id;

                //詳細清單功能
                const cell = row.insertCell();
                const button = document.createElement('button');
                button.textContent = '詳細資料';
                button.className = 'btn btn-primary';
                button.setAttribute('data-bs-toggle', 'modal');
                button.setAttribute('data-bs-target', '#myModal');
                button.addEventListener('click', () => {
                  document.querySelector('.modal-title').textContent = `${order.id}訂單`;
                  document.querySelector('.modal-body').innerHTML = `
                    <p>成立日期: ${order.time}</p>
                    <p>訂單狀態: ${order.status}</p>
                    <p>餐廳: ${order.f_restaurant_id}</p>
                    <p>外送員: ${order.f_driver_id}</p>
                    <p>顧客: ${order.f_customer_id}</p>
                    <p>菜單: ${order.f_dish_id}</p>
                    <p>總金額: ${order.totalmoney}</p>
                  `;
                });
                cell.appendChild(button);

              });
            } else {
              console.error('Data is not an array:', data);
            }
          })
          .catch(error => console.error('Fetch error:', error));
    };

    const selectedOption = ref({operation: ''});

    //篩選功能
    const handleSelection = (event) => {
      selectedOption.value.operation = event.target.value;
      const table = document.getElementById('data');
      const rows = Array.from(table.rows).slice(1);

      switch (selectedOption.value.operation) {
        case 'cancel':
          rows.forEach(row => {
            if (row.cells[2].textContent !== 'Cancelled') {
              row.style.display = 'none';
            } else {
              row.style.display = '';
            }
          });
          break;
        case 'complete':
          rows.forEach(row => {
            if (row.cells[2].textContent !== 'Completed') {
              row.style.display = 'none';
            } else {
              row.style.display = '';
            }
          });
          break;
        case 'pending':
          rows.forEach(row => {
            if (row.cells[2].textContent !== 'Pending') {
              row.style.display = 'none';
            } else {
              row.style.display = '';
            }
          });
          break;
        case 'idAsc':
          rows.sort((a, b) => a.cells[1].textContent.localeCompare(b.cells[1].textContent));
          break;
        case 'idDesc':
          rows.sort((a, b) => b.cells[1].textContent.localeCompare(a.cells[1].textContent));
          break;
        case 'timeOtoN':
          rows.sort((a, b) => new Date(a.cells[1].textContent) - new Date(b.cells[1].textContent));
          break;
        case 'timeNtoO':
          rows.sort((a, b) => new Date(b.cells[1].textContent) - new Date(a.cells[1].textContent));
          break;
        default:
          rows.forEach(row => row.style.display = '');
          break;
      }
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      // 添加排序後的行
      rows.forEach(row => table.appendChild(row));
    };


    return {
      searchTerm,
      searchOrder,
      selectedOption,
      handleSelection
    };


  }

}


</script>

<style>

.box {
  text-align: center;
}

.tool {
  justify-content: space-around;
  margin: 20px 0;
}

.searchArea {
  display: flex;
  justify-content: flex-end;
}

.searchArea input {
  margin-left: 40px;
}

.form-select {
  width: 240px;
  margin-left: 40px;
}
</style>