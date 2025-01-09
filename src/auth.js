import { reactive } from "vue";
import router from "@/router/index.js";

export const authstate = reactive({
        isAuthenticated: false
    }
);

export const getStaffName = reactive({
    name: ''
});

export const login = (account, password) => {
    fetch('http://localhost:8060/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account, password }),
    })
        .then(response => response.json())
        .then(data => {
            //當帳號密碼正確
            if (data.account===account && data.password===password) {
                authstate.isAuthenticated = true;
                getStaffName.name = data.name;//將token存到token
                alert('登入成功');
                router.push('/order');

                //當帳號密碼為空
            }else if(!account || !password){
                alert('欄位不得為空，請輸入帳號密碼');
                throw new Error('Invalid credentials');

                //當帳號密碼有誤
            } else {
                alert('帳號或密碼有誤，請重新輸入');
                throw new Error('Invalid credentials');

            }
        })
        .catch(error => {
            authstate.isAuthenticated = false;
            throw error;
        });
}

export const logout = () => {
    authstate.isAuthenticated = false;
    console.log(authstate.isAuthenticated);
    router.push('/');
    alert('登出成功');
};