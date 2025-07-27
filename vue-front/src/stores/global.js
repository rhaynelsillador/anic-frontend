import { adminApi, apiAuth } from '@/const';
import router from '@/router';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import ajax from "../api/ajax";

const currentYear = new Date().getFullYear();
const isLoaded = ref(false);
const appConfig = ref({
    schoolYear : currentYear,
  });
const isLogin = ref(false);
const loginAccount = ref({})

export const useGlobalStore = defineStore('global', () => {

  isLogin.value = localStorage.getItem('isLogin');

    const fetchGlobalConfig = async () =>  {
      console.log("fetching config....")
      ajax.get(adminApi.config)
      .then(res => {
          appConfig.value = res.data.data
          isLoaded.value = true
          isLogin.value = true

          localStorage.setItem('isLogin', isLogin.value);
      })
      .catch(err => {
        appConfig.value = {}
        isLoaded.value = true
        // isLogin.value = true
        localStorage.setItem('isLogin', isLogin.value);
        console.log("Config fetch error : ", isLogin)
      })
    }

    const getLoginAccount = async () =>  {
      console.log("fetching loginAccount....")
      ajax.get(apiAuth.LoginAccount)
      .then(res => {
        console.log(">>>> ", res)
          loginAccount.value = res.data.data
      })
      .catch(err => {
        loginAccount.value = {}
        console.log("loginAccount fetch error : ", err)
      })
    }
    const checkLoginState = async () =>  {
      await ajax.get(apiAuth.LoginStatus)
      .then(res => {
          if(res.data == true){
            console.log("Detected as loggedin user: Fetching config now ")
            fetchGlobalConfig()
            getLoginAccount()
          }else{
            isLoaded.value = true
            localStorage.removeItem("isLogin")
            router.push('/auth/login')
          }
      })
      .catch(err => {
        console.log(err)
        // Handle 401 response code
        isLoaded.value = true
        localStorage.removeItem("isLogin")
        router.push('/auth/login')
      })
    }

    const logout = async () =>  {
      localStorage.removeItem("token")
      localStorage.removeItem("isLogin")
      await ajax.get(apiAuth.Logout)
      .then(res => {
          isLogin.value = false
          localStorage.removeItem("isLogin")
          console.log("Logout done 1")
          router.push("/auth/login")
          console.log("Logout done 2")
      })
      .catch(err => {
          router.push("/auth/login")
      })
    }
  

  return {
    isLoaded,
    isLogin,
    appConfig,
    loginAccount,
    checkLoginState,
    fetchGlobalConfig,
    getLoginAccount,
    logout
  }
})


