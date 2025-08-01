export const AppInfo = {
  AppName: "vuejs-webapp-sample",
  AppDeveloper: "ybkuroki",
  GithubLink: "https://github.com/ybkuroki/vuejs-webapp-sample"
};

const api = "/api"
const apiAuthBase = api + "/auth"

export const ApiBook = api + "/books"
export const ApiCategory = api + "/categories"
export const ApiBucket = api + "/buckets"
export const ApiTimeLogs = api + "/timelogs"
export const ApiFormat = api + "/formats"

export const ApiAccount = "/admin" +api + "/account"

export const ApiStudent = api + "/v1/student"
export const ApiTeacher = api + "/v1/teacher"
export const ApiSubject = api + "/v1/subject"
export const ApiSection = api + "/v1/section"
export const ApiYearLevel = api + "/v1/yearlevel"
export const ApiSubjectCode = api + "/v1/subjectcode"
export const ApiEnrollment = api + "/v1/enrollment"
export const ApiRoom = api + "/v1/room"
export const ApiAttendance = api + "/v1/attendance"
export const ApiGrade = api + "/v1/grade"
export const ApiSchoolYear = api + "/v1/schoolyear"


export const ApiConfig = api + "/v1/config"


export const apiAuth = {
  LoginStatus: apiAuthBase + "/loginStatus",
  LoginAccount: api + "/v1/loginAccount",
  Login: apiAuthBase + "/login",
  Logout: apiAuthBase + "/logout",
  Signup: apiAuthBase + "/signup",
  
}

export const studentApi = {
  BaseUrl : ApiStudent,
  EnrollUrl : ApiEnrollment,

}

export const teacherApi = {
  BaseUrl : ApiTeacher
}

export const subjectApi = {
  BaseUrl : ApiSubject
}

export const subjectCodeApi = {
  BaseUrl : ApiSubjectCode
}

export const sectionApi = {
  BaseUrl : ApiSection
}

export const yearLeveApi = {
  BaseUrl : ApiYearLevel
}

export const roomApi = {
  BaseUrl : ApiRoom
}

export const attendanceRecordApi = {
  BaseUrl : ApiAttendance
}

export const gradeApi = {
  BaseUrl : ApiGrade
}

export const schoolYearApi = {
  BaseUrl : ApiSchoolYear
}

export const adminApi = {
  config : ApiConfig,
  account : ApiAccount,
  role : "/admin" +api + "/role"
}


export const dashboardApi = {
  academicReport : api+"/v1/report/academic",
}




export const statuses = [{'code' : true, 'name' : 'Active'}, {'code' : false, 'name' : 'Inactive'}]

export const genders = [{"name" : "Male", "code" : "MALE"}, {"name" : "Female", "code" : "FEMALE"} ]

export const enrollmentType = [
    { name: 'New', code: 'NEW' },
    { name: 'Transfer', code: 'TRANSFER' },
];

export const studentStatus = [
    {"name" : "Open", "code" : "OPEN"},
    {"name" : "Enrolled", "code" : "ENROLLED"},
    {"name" : "Graduated", "code" : "GRADUATED"},
    {"name" : "Transferred", "code" : "TRANSFERRED"},
    {"name" : "Dropped", "code" : "DROPPED"},
    {"name" : "Incomplete", "code" : "INCOMPLETE"},
  ]
  
export const groupLevels = [
    {"name" : "Prep", "code" : "PREP"},
    {"name" : "Elementary", "code" : "ELEMENTARY"},
    {"name" : "Junior High", "code" : "JUNIOR_HIGH"},
    {"name" : "Senior High", "code" : "SENIOR_HIG"},
    {"name" : "College", "code" : "COLLEGE"},
  ]


export const primaryColors = [
    { name: 'emerald', palette: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22' } },
    { name: 'green', palette: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' } },
    { name: 'lime', palette: { 50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314', 950: '#1a2e05' } },
    { name: 'orange', palette: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407' } },
    { name: 'amber', palette: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03' } },
    { name: 'yellow', palette: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006' } },
    { name: 'teal', palette: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e' } },
    { name: 'cyan', palette: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344' } },
    { name: 'sky', palette: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49' } },
    { name: 'blue', palette: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' } },
    { name: 'indigo', palette: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b' } },
    { name: 'violet', palette: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065' } },
    { name: 'purple', palette: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764' } },
    { name: 'fuchsia', palette: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e' } },
    { name: 'pink', palette: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724' } },
    { name: 'rose', palette: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519' } }
];