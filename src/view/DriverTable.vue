<template>

  <pagehead/>
  <menubar/>

<div class="page-content">
  <div class="box">
  <div class="title">外送員總表</div>
    <div class="tool">
    <button class="btn btn-success" type="submit" data-bs-toggle="modal" data-bs-target="#myModal">新增外送員</button>
      <form class="searchArea" @submit.prevent="searchDRI">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="searchTerm.term">
        <button class="btn btn-outline-success my-2 my-sm-0"  type="submit">Search</button>
      </form>
      <select class="form-select" @change="handleSelection">
        <option  disabled selected>--排序--</option>
        <option value="nameAsc">依姓名排序(A-Z)</option>
        <option value="nameDesc">依姓名排序(Z-A)</option>
        <option value="idAsc">依id排序(升冪)</option>
        <option value="idDesc">依id排序(降冪)</option>
        <option value="scoreHtoL">依評分(由高到低)</option>
        <option value="scoreLtoH">依評分(由低到高)</option>
        <option value="deliveryHtoL">依外送次數(由高到低)</option>
        <option value="deliveryLtoH">依外送次數(由低到高)</option>

      </select>
    </div>
    </div>
  <table id="data">
    <tr>
      <th> id </th>
      <th> 姓名 </th>
      <th> 電話 </th>
      <th> Email </th>
      <th> 評分 </th>
      <th> 外送次數 </th>
      <th> 功能 </th>
    </tr>
  </table>
</div>

  <div class="modal fade" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h4 class="modal-title">新增外送員</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="addDriver">

          <div class="form-group">
          <label for="id">id:</label>
          <input type="text" class="form-control" id="id" v-model="newDriver.id">
          </div>
          <div class="form-group">
          <label for="name">姓名:</label>
          <input type="text" class="form-control" id="name" v-model="newDriver.name">
          </div>
          <div class="form-group">
          <label for="tel">電話:</label>
          <input type="text" class="form-control" id="tel" v-model="newDriver.tel">
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
          <input type="text" class="form-control" id="email" v-model="newDriver.email">
          </div>
          <div class="form-group">
          <label for="score">評分:</label>
          <input type="text" class="form-control" id="score" v-model="newDriver.score">
          </div>
          <div class="form-group">
            <label for="num_of_delivery">外送次數:</label>
          <input type="text" class="form-control" id="num_of_delivery" v-model="newDriver.num_of_delivery">
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="addDriver">新增</button>
        </div>
        </form>
      </div>
    </div>
  </div>
</div>

  <div class="modal fade" id="updateDriver">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h4 class="modal-title">新增外送員</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="updateDriver">

            <div class="form-group">
              <label for="id">id:</label>
              <input type="text" class="form-control" id="id" v-model="originalDriver.id">
            </div>
            <div class="form-group">
              <label for="name">姓名:</label>
              <input type="text" class="form-control" id="name" v-model="originalDriver.name">
            </div>
            <div class="form-group">
              <label for="tel">電話:</label>
              <input type="text" class="form-control" id="tel" v-model="originalDriver.tel">
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="text" class="form-control" id="email" v-model="originalDriver.email">
            </div>
            <div class="form-group">
              <label for="score">評分:</label>
              <input type="text" class="form-control" id="score" v-model="originalDriver.score">
            </div>
            <div class="form-group">
              <label for="num_of_delivery">外送次數:</label>
              <input type="text" class="form-control" id="num_of_delivery" v-model="originalDriver.num_of_delivery">
            </div>

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

    const newDriver = ref({
      id: '',
      name: '',
      tel: '',
      email: '',
      score: '',
      num_of_delivery: ''
    })

    const originalDriver = ref({
      id: '',
      name: '',
      tel: '',
      email: '',
      score: '',
      num_of_delivery: ''
    })

    const searchTerm = ref({
      term: ''
    })

    const selectedOption = ref({
      option: ''
    })

    const addDriver = () => {
      fetch('http://localhost:8060/api/driver/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDriver.value)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Added data:', data);
        alert('新增成功，請確認');
        window.location.reload();
      })
      .catch(error => console.error('Add error:', error));
    }

    function fetchDriver() {
    fetch('http://localhost:8060/api/driver')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched data:', data); // 添加這行
          if (Array.isArray(data)) {
            data.forEach(driver => {
              const table = document.getElementById('data');
              const row = table.insertRow();
              row.insertCell().textContent = driver.id;
              row.insertCell().textContent = driver.name;
              row.insertCell().textContent = driver.tel;
              row.insertCell().textContent = driver.email;
              row.insertCell().textContent = driver.score;
              row.insertCell().textContent = driver.num_of_delivery;

              const cell = row.insertCell();
              const deleteButton = document.createElement('button');
              deleteButton.textContent = '刪除';
              deleteButton.className = 'btn btn-danger';
              deleteButton.onclick = () => {
                if (window.confirm('確定要刪除嗎?')) {
                  deleteDriver(driver.id);
                  window.location.reload();
                }
              };
              cell.appendChild(deleteButton);

              const updateButton = document.createElement('button');
              updateButton.textContent = '更新';
              updateButton.className = 'btn btn-primary';
              updateButton.setAttribute('data-bs-toggle', 'modal');
              updateButton.setAttribute('data-bs-target', '#updateDriver');
              updateButton.onclick = () => {
               originalDriver.value ={
                id: driver.id,
                name: driver.name,
                tel: driver.tel,
                email: driver.email,
                score: driver.score,
                num_of_delivery: driver.num_of_delivery
               }
              };
              cell.appendChild(updateButton);
            });
          } else {
            console.error('Data is not an array:', data);
          }
        })
        .catch(error => console.error('Fetch error:', error));
  }

  //刪除
  const  deleteDriver = (id) => {
    fetch(`http://localhost:8060/api/driver/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => console.error('Delete error:', error));
  }

  //更新
  const updateDriver = (event) => {
    fetch(`http://localhost:8060/api/driver/${originalDriver.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(originalDriver.value)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Updated data:', data);
      alert('更新成功，請確認');
      window.location.reload();
    })
    .catch(error => console.error('Update error:', error));
  }

    //搜尋
    const searchDRI = (event) => {
      const table = document.getElementById('data');
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
        fetch(`http://localhost:8060/api/driver/search?name=${encodeURIComponent(searchTerm.value.term)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              console.log('Searched data:', data);
              if (Array.isArray(data)) {
                data.forEach(driver => {
                  const table = document.getElementById('data');
                  const row = table.insertRow();
                  row.insertCell().textContent = driver.id;
                  row.insertCell().textContent = driver.name;
                  row.insertCell().textContent = driver.tel;
                  row.insertCell().textContent = driver.email;
                  row.insertCell().textContent = driver.score;
                  row.insertCell().textContent = driver.num_of_delivery;

                  const cell = row.insertCell();
                  const deleteButton = document.createElement('button');
                  deleteButton.textContent = '刪除';
                  deleteButton.className = 'btn btn-danger';
                  deleteButton.onclick = () => {
                    if (window.confirm('確定要刪除嗎?')) {
                      deleteDriver(driver.id);
                      window.location.reload();
                    }
                  };
                  cell.appendChild(deleteButton);

                  const updateButton = document.createElement('button');
                  updateButton.textContent = '更新';
                  updateButton.className = 'btn btn-primary';
                  updateButton.setAttribute('data-bs-toggle', 'modal');
                  updateButton.setAttribute('data-bs-target', '#updateDriver');
                  updateButton.onclick = () => {
                    originalDriver.value = {
                      id: driver.id,
                      name: driver.name,
                      tel: driver.tel,
                      email: driver.email,
                      score: driver.score,
                      num_of_delivery: driver.num_of_delivery
                    }
                  };
                  cell.appendChild(updateButton);
                });
              } else {
                console.error('Data is not an array:', data);
              }
            })
            .catch(error => console.error('Search error:', error));
      }

    const handleSelection = (event) => {
      selectedOption.value.operation = event.target.value;
      const table = document.getElementById('data');
      const rows = Array.from(table.rows).slice(1);
      switch (selectedOption.value.operation) {
        case 'nameAsc':
          rows.sort((a, b) => a.cells[1].textContent.localeCompare(b.cells[1].textContent));
          break;
        case 'nameDesc':
          rows.sort((a, b) => b.cells[1].textContent.localeCompare(a.cells[1].textContent));
          break;
        case 'idAsc':
          rows.sort((a, b) => a.cells[0].textContent - b.cells[0].textContent);
          break;
        case 'idDesc':
          rows.sort((a, b) => b.cells[0].textContent - a.cells[0].textContent);
          break;
        case 'scoreHtoL':
          rows.sort((a, b) => b.cells[4].textContent - a.cells[4].textContent);
          break;
        case 'scoreLtoH':
          rows.sort((a, b) => a.cells[4].textContent - b.cells[4].textContent);
          break;
        case 'deliveryHtoL':
          rows.sort((a, b) => b.cells[5].textContent - a.cells[5].textContent);
          break;
        case 'deliveryLtoH':
          rows.sort((a, b) => a.cells[5].textContent - b.cells[5].textContent);
          break;
        default:
          break;
      }
      rows.forEach(row => table.appendChild(row));
    }


    onMounted(fetchDriver);

    return {
      newDriver,
      addDriver,
      updateDriver,
      deleteDriver,
      originalDriver,
      searchTerm,
      searchDRI,
      handleSelection,
      selectedOption
    }
  }
}





</script>


<style scoped>

.title {
  text-align: center;
}
.searchArea {
  display: flex;
  justify-content: space-between;

}
.tool {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 20px;

}

.form-select {
  margin-left: 40px;
  width: 200px;
}


</style>