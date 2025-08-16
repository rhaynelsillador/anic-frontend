import { adminApi, apiAuth, setupApi } from '@/const';
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
const setupData = ref(null);

export const useGlobalStore = defineStore('global', () => {

  isLogin.value = localStorage.getItem('isLogin');

    const fetchGlobalConfig = async () =>  {
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
      })
    }

    const getLoginAccount = async () =>  {
      ajax.get(apiAuth.LoginAccount)
      .then(res => {
          loginAccount.value = res.data.data
      })
      .catch(err => {
        loginAccount.value = {}
      })
    }

    const fetchSchoolYears = async () => {
      if (schoolYearsLoaded.value) {
        return;
      }
  
      let model = new SchoolYearResponse()
      model.getData({ rows: 1000 },
        (data) => {
          schoolYears.value = data.data;
          schoolYearsLoaded.value = true;
        },
        (err) => {
          schoolYearsLoaded.value = true; // Mark as loaded even on error to prevent infinite retries
        })
    }
    const checkLoginState = async () =>  {
      // First check if setup is complete
      try {
        const setupResponse = await ajax.get(setupApi.BaseUrl + '/status')
        if (setupResponse.data && setupResponse.data.data) {
          setupData.value = setupResponse.data.data
          if (!setupData.value.isSetupComplete) {
            isLoaded.value = true
            router.push('/setup')
            return
          }

          document.title = setupData.value.systemName || "E-System";
        }
      } catch (setupError) {
        // If setup check fails, redirect to setup wizard as a safety measure
        isLoaded.value = true
        router.push('/setup')
        return
      }

      // Setup is complete, proceed with normal login check
      await ajax.get(apiAuth.LoginStatus)
      .then(res => {
          if(res.data == true){
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
          router.push("/auth/login")
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
    setupData,
    checkLoginState,
    fetchGlobalConfig,
    getLoginAccount,
    fetchSchoolYears,
    logout
  }
})


