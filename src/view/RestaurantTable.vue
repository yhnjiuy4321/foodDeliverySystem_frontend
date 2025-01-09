<template>

  <pagehead/>
  <menubar/>

  <div class="page-content" >
    <div class="box">
      <div class="title">餐廳總表</div>
      <div class="tool">
      <button class="btn btn-success" type="submit" data-bs-toggle="modal" data-bs-target="#myModal">新增餐廳</button>
      <form class="searchArea" @submit.prevent="searchRes">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="searchTerm.term">
        <button class="btn btn-outline-success my-2 my-sm-0"  type="submit">Search</button>
      </form>
        <select class="form-select" @change="handleSelection">
          <option disabled selected>--篩選--</option>
          <option value="nameAsc">依姓名排序(A-Z)</option>
          <option value="nameDesc">依姓名排序(Z-A)</option>
          <option value="idAsc">依id排序(升冪)</option>
          <option value="idDesc">依id排序(降冪)</option>
          <option value="scoreHtoL">依評價排序(由高到低)</option>
          <option value="scoreLtoH">依評價排序(由低到高)</option>
        </select>

      </div>
    </div>

  <table id="data">
    <tr>
      <th> id</th>
      <th> 店名</th>
      <th> 電話</th>
      <th> Email</th>
      <th> 地址</th>
      <th> 評價</th>
      <th> 功能</th>
    </tr>
  </table>
  </div>

  <!-- The Modal -->
  <div class="modal fade" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">餐廳新增</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form @submit="addRestaurant">
            <div class="form-group">
              <label for="id">id:</label>
              <input type="text" class="form-control" id="id" v-model="newRestaurant.id">
            </div>
            <div class="form-group">
              <label for="name">姓名:</label>
              <input type="text" class="form-control" id="name" v-model="newRestaurant.name">
            </div>
            <div class="form-group">
              <label for="tel">電話:</label>
              <input type="text" class="form-control" id="tel" v-model="newRestaurant.tel">
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" class="form-control" id="email" v-model="newRestaurant.email">
            </div>
            <div class="form-group">
              <label for="address">地址:</label>
              <input type="text" class="form-control" id="address" v-model="newRestaurant.address">
            </div>
            <div class="form-group">
              <label for="score">評價:</label>
              <input type="text" class="form-control" id="score" v-model="newRestaurant.score">
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

  <div class="modal fade" id="updateRes">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">餐廳更新</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form @submit="updateRestaurant">
            <div class="form-group">
              <label for="id">id:</label>
              <input type="text" class="form-control" id="id" v-model="originalRestaurant.id">
            </div>
            <div class="form-group">
              <label for="name">店名:</label>
              <input type="text" class="form-control" id="name" v-model="originalRestaurant.name">
            </div>
            <div class="form-group">
              <label for="tel">電話:</label>
              <input type="text" class="form-control" id="tel" v-model="originalRestaurant.tel">
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" class="form-control" id="email" v-model="originalRestaurant.email">
            </div>
            <div class="form-group">
              <label for="address">地址:</label>
              <input type="text" class="form-control" id="address" v-model="originalRestaurant.address">
            </div>
            <div class="form-group">
              <label for="score">評價:</label>
              <input type="text" class="form-control" id="score" v-model="originalRestaurant.score">
            </div>
            <br>
            <div class="form-group">
              <label for="file">上傳圖片:</label><br>
              <input type="file" id="file" @change="uploadImage">
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="reset" class="btn btn-info" >清空</button>
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
import {useRouter} from 'vue-router';
import pagehead from '@/components/pageHead.vue';
import menubar from "@/components/MenuBar.vue";

export default {
  components: {
    pagehead,
    menubar
  },
  setup() {
    const router = useRouter();
    const newRestaurant = ref({
      id: '',
      name: '',
      tel: '',
      email: '',
      address: '',
      score: '',
      photo: ''
    });

    // 導向Menu.vue頁面，並將餐廳ID作為參數，以便取得該餐廳的菜單
    const goToMenu = (id) => {
      router.push({ name: 'MenuDetail', params: { id: id } });
    };

    onMounted(() => {
      fetchRestaurant();
    });

    const originalRestaurant = ref({
      id: '',
      name: '',
      tel: '',
      email: '',
      address: '',
      score: '',
      photo: ''
    });

    const searchTerm = ref({term: ''});
    const selectedOption = ref({operation: ''});

    let photoPath = '';

    // 新增餐廳
    const addRestaurant = async (event) => {
      event.preventDefault();
      try {

        const response = await fetch('http://localhost:8060/api/restaurant/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newRestaurant.value)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        window.location.reload();
        console.log('Added data:', data);

      } catch (error) {
        console.error('Add error:', error);
      }
    };



    // 刪除餐廳
    const deleteRestaurant = (id) => {
      fetch(`http://localhost:8060/api/restaurant/${id}`, {
        method: 'DELETE'
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            // 跳出警告訊息詢問是否確定刪除
            if (window.confirm('確定要刪除嗎?')) {
              window.location.reload();
              return response.json();
            }
          })
          .then(data => {
            console.log('Deleted data:', data);
          })
          .catch(error => console.error('Delete error:', error));
    };

    // 更新餐廳資料
    const updateRestaurant = async (event) => {
      try {
        const response = await fetch(`http://localhost:8060/api/restaurant/${originalRestaurant.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(originalRestaurant.value)
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        //window.location.reload();
        console.log('Updated data:', data);
      } catch (error) {
        console.error('Update error:', error);
      }
      await uploadImage(event);
    };


    // 取得餐廳資料
    function fetchRestaurant() {
      const table = document.getElementById('data');
      // 清空表格中的所有行，保留表頭
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      fetch('http://localhost:8060/api/restaurant')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetched data:', data);
            if (Array.isArray(data)) {
              data.forEach(restaurant => {
                const row = table.insertRow();
                row.insertCell().textContent = restaurant.id;
                row.insertCell().textContent = restaurant.name;
                row.insertCell().textContent = restaurant.tel;
                row.insertCell().textContent = restaurant.email;
                row.insertCell().textContent = restaurant.address;
                row.insertCell().textContent = restaurant.score;

                // 新增see more按鈕
                const cell = row.insertCell();
                const seeButton = document.createElement('button');
                seeButton.textContent = '查看';
                seeButton.className = 'btn btn-warning';
                seeButton.onclick = () => goToMenu(restaurant.id);// 點擊時觸發方法，導向Menu頁面
                cell.appendChild(seeButton);

                // 新增delete按鈕
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '刪除';
                deleteButton.className = 'btn btn-danger';
                deleteButton.onclick = () => {
                  if (window.confirm('確定要刪除嗎?')) {
                    deleteRestaurant(restaurant.id);
                    window.location.reload();
                  }
                }
                cell.appendChild(deleteButton);

                //新增update按鈕
                const updateButton = document.createElement('button');
                updateButton.textContent = '更新';
                updateButton.className = 'btn btn-primary';
                updateButton.setAttribute('data-bs-toggle', 'modal');
                updateButton.setAttribute('data-bs-target', '#updateRes');
                updateButton.onclick = () => {// 點擊時觸發方法，更新該餐廳
                  originalRestaurant.value.id = restaurant.id;
                  originalRestaurant.value.name = restaurant.name;
                  originalRestaurant.value.tel = restaurant.tel;
                  originalRestaurant.value.email = restaurant.email;
                  originalRestaurant.value.address = restaurant.address;
                  originalRestaurant.value.score = restaurant.score;
                  originalRestaurant.value.photo = restaurant.photo;
                }
                cell.appendChild(updateButton);

              });
            } else {
              console.error('Data is not an array:', data);
            }
          })
          .catch(error => console.error('Fetch error:', error));
    }

    //上傳圖片
    const uploadImage = async (event) => {
      if (!event.target || !event.target.files || event.target.files.length === 0) {
        console.error('No file selected');
        return;
      }
      try {
        const file = event.target.files[0];  // 同一個檔案
        const formData = new FormData();
        formData.append('file', file);

          // 上傳到 originalRestaurant
          const resp_update = await fetch(`http://localhost:8060/api/restaurant/upload/${originalRestaurant.value.id}`, {
            method: 'POST',
            body: formData
          });

          if (!resp_update.ok) {
            throw new Error('Original restaurant upload failed');
          }

        photoPath = await resp_update.text();
          console.log('Uploaded photo path:', photoPath);
          originalRestaurant.value.photo = photoPath;
          console.log('Updated originalRestaurant photo:', originalRestaurant.value.photo);

      } catch (error) {
        console.error('Upload error:', error);
      }
    };

    // 搜尋餐廳
    const searchRes = (event) => {
      const table = document.getElementById('data');
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      fetch(`http://localhost:8060/api/restaurant/search?name=${encodeURIComponent(searchTerm.value.term)}`, {
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
              data.forEach(restaurant => {
                const table = document.getElementById('data');
                const row = table.insertRow();
                row.insertCell().textContent = restaurant.id;
                row.insertCell().textContent = restaurant.name;
                row.insertCell().textContent = restaurant.tel;
                row.insertCell().textContent = restaurant.email;
                row.insertCell().textContent = restaurant.address;
                row.insertCell().textContent = restaurant.score;


                const cell = row.insertCell();
                //查看按鈕
                const seeButton = document.createElement('button');
                seeButton.textContent = '查看';
                seeButton.className = 'btn btn-warning';
                seeButton.onclick = () => goToMenu(restaurant.id);
                cell.appendChild(seeButton);

                //刪除按鈕
                const button = document.createElement('button');
                button.textContent = '刪除';
                button.className = 'btn btn-danger';
                button.onclick = () => {
                  if (window.confirm('確定要刪除嗎?')) {
                    deleteRestaurant(restaurant.id);
                    window.location.reload();
                  }
                }
                cell.appendChild(button);

                //修改按鈕
                const button2 = document.createElement('button');
                button2.textContent = '修改';
                button2.className = 'btn btn-primary';
                button2.setAttribute('data-bs-toggle', 'modal');
                button2.setAttribute('data-bs-target', '#updateRes');
                button2.onclick = () => {
                  originalRestaurant.value = {
                    id: restaurant.id,
                    name: restaurant.name,
                    tel: restaurant.tel,
                    email: restaurant.email,
                    address: restaurant.address
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

    // 排序
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
          case 'scoreHtoL':
          rows.sort((a, b) => b.cells[5].textContent - a.cells[5].textContent);
          break;
        case 'scoreLtoH':
          rows.sort((a, b) => a.cells[5].textContent - b.cells[5].textContent);
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


    return {
      newRestaurant,
      addRestaurant,
      updateRestaurant,
      originalRestaurant,
      uploadImage,
      searchTerm,
      searchRes,
      handleSelection,
      selectedOption
    };
  }
};
</script>

<style scoped>

.box {
 text-align: center;
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
}

.searchArea input {
  margin-left: 40px;
}

.form-select {
  width: 240px;
  margin-left: 40px;
}
</style>