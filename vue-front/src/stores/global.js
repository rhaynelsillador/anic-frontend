import { adminApi, apiAuth } from '@/const';
import router from '@/router';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import ajax from "../api/ajax";
import SchoolYearResponse from '@/types/school_year';

const currentYear = new Date().getFullYear();
const isLoaded = ref(false);
const appConfig = ref({
    schoolYear : currentYear,
  });
const isLogin = ref(false);
const loginAccount = ref({});
const schoolYears = ref([]);
const schoolYearsLoaded = ref(false);

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

    const fetchSchoolYears = async () => {
      if (schoolYearsLoaded.value) {
        console.log("School years already loaded, skipping fetch")
        return;
      }
      
      console.log("fetching school years....")
      let model = new SchoolYearResponse()
      model.getData({ rows: 1000 },
        (data) => {
          schoolYears.value = data.data;
          schoolYearsLoaded.value = true;
          console.log("School years loaded:", data.data.length, "records")
        },
        (err) => {
          console.log('Error fetching school years:', err);
          schoolYearsLoaded.value = true; // Mark as loaded even on error to prevent infinite retries
        })
    }
    const checkLoginState = async () =>  {
      await ajax.get(apiAuth.LoginStatus)
      .then(res => {
          if(res.data == true){
            console.log("Detected as loggedin user: Fetching config now ")
            fetchGlobalConfig()
            getLoginAccount()
            fetchSchoolYears()
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
    schoolYears,
    schoolYearsLoaded,
    checkLoginState,
    fetchGlobalConfig,
    getLoginAccount,
    fetchSchoolYears,
    logout
  }
})


