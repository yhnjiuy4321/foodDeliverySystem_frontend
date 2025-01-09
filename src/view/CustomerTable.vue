<template>

  <pagehead/>
  <menubar/>


  <div class="page-content">
    <div class="box">
      <div class="title">顧客總表</div>
      <div class="tool">
        <button class="btn btn-success" type="submit" data-bs-toggle="modal" data-bs-target="#myModal">新增顧客</button>
        <form class="searchArea" @submit.prevent="searchCUS">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="searchTerm.term">
          <button class="btn btn-outline-success my-2 my-sm-0"  type="submit">Search</button>
        </form>
        <select class="form-select" @change="handleSelection">
          <option  disabled selected>--篩選--</option>
          <option value="nameAsc">依姓名排序(A-Z)</option>
          <option value="nameDesc">依姓名排序(Z-A)</option>
          <option value="idAsc">依id排序(升冪)</option>
          <option value="idDesc">依id排序(降冪)</option>
        </select>
      </div>
    </div>
  <table id="data">
    <tr>
      <th> id  </th>
      <th> 姓名 </th>
      <th> 電話 </th>
      <th> Email </th>
      <th> 地址 </th>
      <th> 功能 </th>
    </tr>
  </table>
  </div>

  <!-- The Modal -->
  <div class="modal fade" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">顧客新增</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form @submit="addCustomer">
            <div class="form-group">
              <label for="id">id:</label>
              <input type="text" class="form-control" id="id" v-model="newCustomer.id">
            </div>
            <div class="form-group">
              <label for="name">姓名:</label>
              <input type="text" class="form-control" id="name" v-model="newCustomer.name">
            </div>
            <div class="form-group">
              <label for="tel">電話:</label>
              <input type="text" class="form-control" id="tel" v-model="newCustomer.tel">
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" class="form-control" id="email" v-model="newCustomer.email">
            </div>
            <div class="form-group">
              <label for="address">地址:</label>
              <input type="text" class="form-control" id="address" v-model="newCustomer.address">
            </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">取消</button>
          <button type="submit" class="btn btn-primary" >新增</button>
        </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- The Modal -->
  <div class="modal fade" id="updateModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">顧客更新</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form @submit="updateCustomer">
            <div class="form-group">
              <label for="id">id:</label>
              <input type="text" class="form-control" id="id" v-model="originalCustomer.id">
            </div>
            <div class="form-group">
              <label for="name">姓名:</label>
              <input type="text" class="form-control" id="name" v-model="originalCustomer.name">
            </div>
            <div class="form-group">
              <label for="tel">電話:</label>
              <input type="text" class="form-control" id="tel" v-model="originalCustomer.tel">
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" class="form-control" id="email" v-model="originalCustomer.email">
            </div>
            <div class="form-group">
              <label for="address">地址:</label>
              <input type="text" class="form-control" id="address" v-model="originalCustomer.address">
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">取消</button>
              <button type="submit" class="btn btn-primary" >送出</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>






</template>

<style scoped>

.box {
  text-align: center;
  width: 100%;
}

.tool {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
}


.searchArea {
  display: flex;
  justify-content: flex-end;
  margin-left: 40px;

}

.form-select {
  margin-left: 40px;
  width: 200px;
}

</style>

<script>
import pagehead from '@/components/pageHead.vue';
import menubar from "@/components/MenuBar.vue";
import {onMounted, ref} from 'vue';
import './Table.css';

export default {
  components: {
    pagehead,
    menubar
  },
  setup() {
    const newCustomer = ref({
      id: '',
      name: '',
      tel: '',
      email: '',
      address: ''
    });

    const originalCustomer = ref({
      id: '',
      name: '',
      tel: '',
      email: '',
      address: ''
    });

    const searchTerm = ref({term: ''});

    const selectedOption = ref({operation: ''});



    function fetchCustomers() {
      fetch('http://localhost:8060/api/customer')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetched data:', data);
            if (Array.isArray(data)) {
              data.forEach(customer => {
                const table = document.getElementById('data');
                const row = table.insertRow();
                row.insertCell().textContent = customer.id;
                row.insertCell().textContent = customer.name;
                row.insertCell().textContent = customer.tel;
                row.insertCell().textContent = customer.email;
                row.insertCell().textContent = customer.address;

                //刪除按鈕
                const cell = row.insertCell();
                const button = document.createElement('button');
                button.textContent = '刪除';
                button.className = 'btn btn-danger';
                button.onclick = () => {
                  if(window.confirm('確定要刪除嗎?')){
                    deleteCustomer(customer.id);
                    window.location.reload();
                  }
                }
                cell.appendChild(button);

                //修改按鈕
                const button2 = document.createElement('button');
                button2.textContent = '修改';
                button2.className = 'btn btn-primary';
                button2.setAttribute('data-bs-toggle', 'modal');
                button2.setAttribute('data-bs-target', '#updateModal');
                button2.onclick = () => {
                  originalCustomer.value = {
                    id: customer.id,
                    name: customer.name,
                    tel: customer.tel,
                    email: customer.email,
                    address: customer.address
                  };
                }
                cell.appendChild(button2);

              });
            } else {
              console.error('Data is not an array:', data);
            }
          })
          .catch(error => console.error('Fetch error:', error));
    }

    const deleteCustomer = (id) => {
      fetch(`http://localhost:8060/api/customer/${id}`, {
        method: 'DELETE'
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
              return response.json();
          })
          .catch(error => console.error('Delete error:', error));
    };

    //新增
    const addCustomer = () => {
      fetch('http://localhost:8060/api/customer/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCustomer.value)//用意是將newCustomer的值轉成JSON格式，並放入body，送出
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Posted data:', data);
            const table = document.getElementById('data');
            const row = table.insertRow();
            row.insertCell().textContent = data.id;
            row.insertCell().textContent = data.name;
            row.insertCell().textContent = data.tel;
            row.insertCell().textContent = data.email;
            row.insertCell().textContent = data.address;
            newCustomer.value = {
              id: '',
              name: '',
              tel: '',
              email: '',
              address: ''
            };
          })
          .catch(error => console.error('Fetch error:', error));
    };

    //更新
    const updateCustomer = (event) => {
      fetch(`http://localhost:8060/api/customer/${originalCustomer.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(originalCustomer.value)
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .catch(error => console.error('Update error:', error));
    };

    //搜尋(姓名)
    const searchCUS = (event) => {
     const table = document.getElementById('data');
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      fetch(`http://localhost:8060/api/customer/search?name=${encodeURIComponent(searchTerm.value.term)}`, {
        //encodeURIComponent用於編碼 URI 組件，將某些字符替換為一個或多個表示該字符的 UTF-8 編碼的轉義序列。這樣可以確保查詢參數中的特殊字符（如空格、&、= 等）被正確編碼，不會干擾 URL 的結構。
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetched data:', data);
            if (Array.isArray(data)) {
              data.forEach(customer => {
                const table = document.getElementById('data');
                const row = table.insertRow();
                row.insertCell().textContent = customer.id;
                row.insertCell().textContent = customer.name;
                row.insertCell().textContent = customer.tel;
                row.insertCell().textContent = customer.email;
                row.insertCell().textContent = customer.address;


                //刪除按鈕
                const cell = row.insertCell();
                const button = document.createElement('button');
                button.textContent = '刪除';
                button.className = 'btn btn-danger';
                button.onclick = () => {
                  if(window.confirm('確定要刪除嗎?')){
                    deleteCustomer(customer.id);
                    window.location.reload();
                  }
                }
                cell.appendChild(button);

                //修改按鈕
                const button2 = document.createElement('button');
                button2.textContent = '修改';
                button2.className = 'btn btn-primary';
                button2.setAttribute('data-bs-toggle', 'modal');
                button2.setAttribute('data-bs-target', '#updateModal');
                button2.onclick = () => {
                  originalCustomer.value = {
                    id: customer.id,
                    name: customer.name,
                    tel: customer.tel,
                    email: customer.email,
                    address: customer.address
                  };
                }
                cell.appendChild(button2);
              });
            } else {
              console.error('Data is not an array:', data);
            }
          })
          .catch(error => console.error('Fetch error:', error));
    };

    //排序
    const handleSelection = (event) => {
      selectedOption.value.operation = event.target.value;
      const table = document.getElementById('data');
      const rows = Array.from(table.rows).slice(1);

      switch (selectedOption.value.operation) {
        case 'nameAsc':
          //nameAsc();
          rows.sort((a, b) => a.cells[1].textContent.localeCompare(b.cells[1].textContent));
          break;
        case 'nameDesc':
          rows.sort((a, b) => b.cells[1].textContent.localeCompare(a.cells[1].textContent));
          break;
        case 'idAsc':
          rows.sort((a, b) => a.cells[0].textContent.localeCompare(b.cells[0].textContent));
          break;
        case 'idDesc':
          rows.sort((a, b) => b.cells[0].textContent.localeCompare(a.cells[0].textContent));
          break;
        default:
          break;
      }
      // 清空表格，保留表頭
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }

      // 添加排序後的行
      rows.forEach(row => table.appendChild(row));
    };




    onMounted(fetchCustomers);

    return {
      newCustomer,
      addCustomer,
      updateCustomer,
      originalCustomer,
      searchCUS,
      searchTerm,
      selectedOption,
      handleSelection
    };
  }
}


</script>