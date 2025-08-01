import AppLayout from '@/layout/AppLayout.vue';
import { useGlobalStore } from '@/stores/global';
import { createRouter, createWebHistory } from 'vue-router';

const isLoging = false;

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/management/student',
                    name: 'studentlist',
                    component: () => import('@/views/pages/management/StudentView.vue')
                },
                {
                    path: '/management/teacher',
                    name: 'teacherlist',
                    component: () => import('@/views/pages/management/TeacherView.vue')
                },
                {
                    path: '/management/classes',
                    name: 'classeslist',
                    component: () => import('@/views/pages/management/ClassesView.vue')
                },
                {
                    path: '/management/section',
                    name: 'sectionlist',
                    component: () => import('@/views/pages/management/SectionView.vue')
                },
                {
                    path: '/management/subject',
                    name: 'subjectlist',
                    component: () => import('@/views/pages/management/SubjectView.vue')
                },
                {
                    path: '/management/documents',
                    name: 'documentlist',
                    component: () => import('@/views/pages/management/DocumentsView.vue')
                },
                {
                    path: '/management/schoolyear',
                    name: 'schoolyearlist',
                    component: () => import('@/views/pages/management/SchoolYearView.vue')
                },
                {
                    path: '/management/documents/form',
                    name: 'documentform',
                    component: () => import('@/views/pages/management/forms/DocumentsForm.vue')
                },
                {
                    path: '/enrollment/student',
                    name: 'newstudent',
                    component: () => import('@/views/pages/enrollment/NewStudentView.vue')
                },
                {
                    path: '/enrollment/student/:id',
                    name: 'updatestudent',
                    component: () => import('@/views/pages/management/StudentRecordsView.vue')
                },
                {
                    path: '/enrollment/subject/assignment',
                    name: 'subjectassignment',
                    component: () => import('@/views/pages/enrollment/SubjectAssignmentView.vue')
                },
                {
                    path: '/enrollment/enrolled/student',
                    name: 'enrolledstudent',
                    component: () => import('@/views/pages/enrollment/students/EnrolledStudentView.vue')
                },
                {
                    path: '/teacher/index',
                    name: 'teacherview',
                    component: () => import('@/views/pages/teacher/MainMenuView.vue')
                },
                {
                    path: '/settings/index',
                    name: 'settings-index',
                    component: () => import('@/views/pages/setting/Settings.vue')
                },

                {
                    path: '/settings/profile',
                    name: 'settings-profile',
                    component: () => import('@/views/pages/setting/ProfileSettings.vue')
                },
                {
                    path: '/settings/users',
                    name: 'settings-users',
                    component: () => import('@/views/pages/setting/AccountListView.vue')
                },
                {
                    path: '/settings/roles',
                    name: 'settings-roles',
                    component: () => import('@/views/pages/setting/RoleListView.vue')
                },
                
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                },
                {
                    path: '/auth/access',
                    name: 'accessDenied',
                    component: () => import('@/views/pages/auth/Access.vue')
                },
        
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        // {
        //     path: '/auth/access',
        //     name: 'accessDenied',
        //     component: () => import('@/views/pages/auth/Access.vue')
        // },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/auth/login']
  const authRequired = !publicPages.some(p => to.path.startsWith(p))

  const userStore = useGlobalStore()
  console.log("Checking route:", to.path, "isLogin:", userStore.isLogin)

  if (authRequired && !userStore.isLogin) {
    return next('/auth/login')
  } else if (!authRequired && userStore.isLogin && to.path === '/auth/login') {
    return next('/') // redirect logged-in user out of login page
  }

  next()
})

export default router;
