<template>

  <pagehead/>
  <menubar/>


  <!-- 餐廳資訊 -->
  <div class="page-content" v-if="restaurant">
    <goback/>
    <div class="info">
      <div class="photo">
        <!-- 放圖 -->
        <img :src="'http://localhost:8060/uploads/'+restaurant.photo" alt="photo">

      </div>
      <div class="restaurant" id="demo">
        <div>餐廳id: {{restaurant.id}}</div>
        <div>餐廳名稱: {{restaurant.name}}</div>
        <div>電話: {{restaurant.tel}}</div>
        <div>Email: {{restaurant.email}}</div>
        <div>地址: {{restaurant.address}}</div>
      </div>
  </div>

    <!-- 菜單資訊 -->
    <div class="box">
      <div class="title text-center">菜色清單</div>
      <div class="tool">
<button class="btn btn-success" type="submit" data-bs-toggle="modal" data-bs-target="#myMenu">新增菜單</button>
        <form class="searchArea" @submit.prevent="searchMenu">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="searchTerm.term">
          <button class="btn btn-outline-success my-2 my-sm-0"  type="submit">Search</button>
        </form>
        <select class="form-select" @change="handleSelection">
          <option  disabled selected>--排序--</option>
          <option value="costHtoL">依價格(由高到低)</option>
          <option value="costLtoH">依價格(由低到高)</option>
          <option value="scoreHtoL">依評分(由高到低)</option>
          <option value="scoreLtoH">依評分(由低到高)</option>
        </select>
    </div>
    </div>
    <table id="data">
      <tr>
        <th> id </th>
        <th> 菜名 </th>
        <th> 圖片 </th>
        <th> 價格 </th>
        <th> 評分 </th>
        <th> 功能 </th>
      </tr>
    </table>
  </div>

  <!-- The Modal -->
  <div class="modal fade" id="myMenu">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">新增菜單</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body ">
          <form @submit="addMenu">
            <div class="form-group">
              <label for="id">id:</label>
              <input type="text" class="form-control" id="id" v-model="newMenu.id">
            </div>
            <div class="form-group">
              <label for="name">菜名:</label>
              <input type="text" class="form-control" id="name" v-model="newMenu.name">
            </div>
            <div class="form-group">
              <label for="cost">價格:</label>
              <input type="text" class="form-control" id="cost" v-model="newMenu.cost">
            </div>
            <div class="form-group">
              <label for="score">評分:</label>
              <input type="text" class="form-control" id="score" v-model="newMenu.score">
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

  <div class="modal fade" id="updateMenu">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">更新菜單</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body ">
          <form @submit="updateMenu">
            <div class="form-group">
              <label for="id">id:</label>
              <input type="text" class="form-control" id="id" v-model="originalMenu.id">
            </div>
            <div class="form-group">
              <label for="name">菜名:</label>
              <input type="text" class="form-control" id="name" v-model="originalMenu.name">
            </div>
            <div class="form-group">
              <label for="cost">價格:</label>
              <input type="text" class="form-control" id="cost" v-model="originalMenu.cost">
            </div>
            <div class="form-group">
              <label for="score">評分:</label>
              <input type="text" class="form-control" id="score" v-model="originalMenu.score">
            </div>
            <div class="form-group">
              <label for="photo">圖片:</label>
              <input type="file" class="form-control" id="photo" @change="uploadImage">
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

<script>
import './Table.css';
import {onMounted, ref} from "vue";
import {useRoute} from 'vue-router';
import goback from "@/components/GoBack.vue";
import pagehead from '@/components/pageHead.vue';
import menubar from "@/components/MenuBar.vue";

export default {
  components: {
    pagehead,
    menubar,
    goback
  },

  setup() {

    window.scroll(0, 0);

    const route = useRoute();
    const id = route.params.id
    const restaurant = ref({
      id: route.params.id,
      name: route.params.name,
      tel: route.params.tel,
      email: route.params.email,
      address: route.params.address,
      photo: route.params.photo

    });

    const newMenu = {
      id: '',
      name: '',
      photo: '',
      cost: '',
      score: '',
      f_restaurant_id: restaurant.value.id
    };

    //原資料顯示
    const originalMenu = ref({
      id: '',
      name: '',
      photo: '',
      cost: '',
      score: '',
      f_restaurant_id: restaurant.value.id
    });

    const searchTerm = ref({term: ''});
    const selectedOption = ref({option: ''})

    //取得菜單
    onMounted(() => {

      //清空表格，避免重複顯示
      const table = document.getElementById('data');
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }


      //抓取指定id的餐廳資料
      fetch(`http://localhost:8060/api/restaurant/${id}`, {
        method: 'GET'
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();//將資料轉成json格式

          })
          .then(data => {
            console.log('Fetched data:', data);
            if(data!=null){
              restaurant.value.id = data.id;
              restaurant.value.name = data.name;
              restaurant.value.tel = data.tel;
              restaurant.value.email = data.email;
              restaurant.value.address = data.address;
              restaurant.value.photo = data.photo;

            }
          })
          .catch(error => console.error('Fetch error:', error));


      //取得菜單方法
      fetch(`http://localhost:8060/api/menu/${id}`, {
        method: 'GET'
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
              data.forEach(menu => {
                const table = document.getElementById('data');
                const row = table.insertRow();
                row.insertCell().textContent = menu.id;
                row.insertCell().textContent = menu.name;
                //圖片放入表格中
                const cell2 = row.insertCell();
                const img = document.createElement('img');
                img.src = 'http://localhost:8060' + menu.photo;
                img.width = 200;
                cell2.appendChild(img);


                row.insertCell().textContent = menu.cost;
                row.insertCell().textContent = menu.score;

                //功能:刪除
                const cell = row.insertCell();
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '刪除';
                deleteButton.className = 'btn btn-danger';
                deleteButton.onclick = () => deleteMenu(menu.id);
                cell.appendChild(deleteButton);

                //功能:更新
                const updateButton = document.createElement('button');
                updateButton.textContent = '更新';
                updateButton.className = 'btn btn-primary';
                updateButton.setAttribute('data-bs-toggle', 'modal');
                updateButton.setAttribute('data-bs-target', '#updateMenu');
                //點擊時觸發方法，跳出modal，原資料顯示在modal中
                updateButton.onclick = () => {
                  originalMenu.value.id = menu.id;
                  originalMenu.value.name = menu.name;
                  originalMenu.value.cost = menu.cost;
                  originalMenu.value.score = menu.score;
                  originalMenu.value.photo = menu.photo;
                };
                cell.appendChild(updateButton);

              });
            } else {
              console.error('Data is not an array:', data);
            }
          })
          .catch(error => console.error('Fetch error:', error));

    });


    //更新菜單
    const updateMenu = async (event) => {
      try {
        const response = await fetch(`http://localhost:8060/api/menu/${originalMenu.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(originalMenu.value)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Updated data:', data);

      } catch (error) {
        console.error('Update error:', error);
      }
    };

    // 刪除菜單
    const deleteMenu = (id) => {
      fetch(`http://localhost:8060/api/menu/${id}`, {
        method: 'DELETE'
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            if (window.confirm('確定要刪除嗎?')) {
              window.location.reload();
              return response.json();
            }
          })
          .catch(error => console.error('Delete error:', error));
    };

    //新增菜單
    const addMenu = (event) => {
      event.preventDefault();
      fetch('http://localhost:8060/api/menu/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMenu)
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            window.location.reload();
            return response.json();
          })
          .catch(error => console.error('Add error:', error));
    };

    const uploadImage = async (event) => {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      try {
        const response = await fetch(`http://localhost:8060/api/menu/upload/${originalMenu.value.id}`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.text()
        console.log('Uploaded data:', data);
        originalMenu.value.photo = data;


      } catch (error) {
        console.error('Upload error:', error);
      }
    };

    /*const getFileName = (event) => {
      originalMenu.value.photo = event.target.files[0].name;
      console.log(originalMenu.value.photo);
    };*/

    const searchMenu = (event) => {
      const table = document.getElementById('data');
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      event.preventDefault();
      fetch(`http://localhost:8060/api/menu/${restaurant.value.id}/search?name=${encodeURIComponent(searchTerm.value.term)}`, {
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
            console.log('Fetched data:', data);
            if (Array.isArray(data)) {
              const table = document.getElementById('data');
              while (table.rows.length > 1) {
                table.deleteRow(1);
              }
              data.forEach(menu => {
                const row = table.insertRow();
                row.insertCell().textContent = menu.id;
                row.insertCell().textContent = menu.name;
                //圖片放入表格中
                const cell2 = row.insertCell();
                const img = document.createElement('img');
                img.src = 'http://localhost:8060' + menu.photo;
                img.width = 200;
                cell2.appendChild(img);

                row.insertCell().textContent = menu.cost;
                row.insertCell().textContent = menu.score;

                //功能:刪除
                const cell = row.insertCell();
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '刪除';
                deleteButton.className = 'btn btn-danger';
                deleteButton.onclick = () => deleteMenu(menu.id);
                cell.appendChild(deleteButton);

                //功能:更新
                const updateButton = document.createElement('button');
                updateButton.textContent = '更新';
                updateButton.className = 'btn btn-primary';
                updateButton.setAttribute('data-bs-toggle', 'modal');
                updateButton.setAttribute('data-bs-target', '#updateMenu');
                //點擊時觸發方法，跳出modal，原資料顯示在modal中
                updateButton.onclick = () => {
                  originalMenu.value.id = menu.id;
                  originalMenu.value.name = menu.name;
                  originalMenu.value.cost = menu.cost;
                  originalMenu.value.score = menu.score;
                  originalMenu.value.photo = menu.photo;
                };
                cell.appendChild(updateButton);

              });
            } else {
              console.error('Data is not an array:', data);
            }
          })
          .catch(error => console.error('Fetch error:', error));
    };

    const handleSelection = (event) => {
      selectedOption.value.operation = event.target.value;
      const table = document.getElementById('data');
      const rows = Array.from(table.rows).slice(1);
      switch (selectedOption.value.operation) {
        case 'costHtoL':
          rows.sort((a, b) => {
            return b.cells[3].textContent - a.cells[3].textContent;
          });
          break;
        case 'costLtoH':
          rows.sort((a, b) => {
            return a.cells[3].textContent - b.cells[3].textContent;
          });
          break;
        case 'scoreHtoL':
          rows.sort((a, b) => {
            return b.cells[4].textContent - a.cells[4].textContent;
          });
          break;
        case 'scoreLtoH':
          rows.sort((a, b) => {
            return a.cells[4].textContent - b.cells[4].textContent;
          });
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


    return {
      newMenu,
      addMenu,
      updateMenu,
      originalMenu,
      restaurant,
      uploadImage,
      searchTerm,
      searchMenu,
      handleSelection,
      selectedOption
    };
  }
}
</script>

<style scoped>

.restaurant {
  display: grid;
  margin: 10px;
  justify-content: center;
  font-size: 20px;
}

.restaurant div {
  text-align: start;
  margin: 5px;
}

.restaurant button {
  width: 50%;
}


.info{
  display: flex;
  justify-content: center;
  margin: 10px;
}

  .photo {
    margin: 10px;
    overflow: hidden;
    border-radius: 5%;
  }

  .photo img {
    width: 300px;
    height: 250px;
    object-fit: cover;
  }

  .tool {
    display: flex;
    justify-content: space-between;
    margin: 10px;
  }

  .searchArea {
    display: flex;
    justify-content: center;
  }

  .form-select {
    margin-left: 40px;
    width: 200px;
  }




</style>