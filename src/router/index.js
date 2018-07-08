import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views - Pages
import Login from '@/views/pages/Login'
import Profile from '@/views/pages/Profile'

import Redirect from '@/views/Redirect'

// Student
import InternList from '@/views/student/InternList'
import InternAdd from '@/views/student/InternAdd'
import InternDetail from '@/views/student/InternDetail'

// Company
import CompanyInternList from '@/views/company/CompanyInternList'
import CompanyInternDetail from '@/views/company/CompanyInternDetail'
import ConfirmedInternList from '@/views/company/ConfirmedInternList'
import CompanyOldInternList from '@/views/company/OldInternList'
import MemberList from '@/views/company/MemberList'
import MemberAdd from '@/views/company/MemberAdd'

// School
import Faculty from '@/views/school/Faculty'
import Department from '@/views/school/Department'
import Student from '@/views/school/Student'
import Teacher from '@/views/school/Teacher'
import SchoolInternList from '@/views/school/SchoolInternList'
import SchoolConfirmedInternList from '@/views/school/SchoolConfirmedInternList'
import SchoolInternDetail from '@/views/school/SchoolInternDetail'
import CompanyList from '@/views/school/CompanyList'

Vue.use(Router)

export default new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required!
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: 'redirect',
      component: Full,
      children: [
        {
          path: 'redirect',
          name: 'Redirect',
          component: Redirect
        },
        {
          path: 'student',
          redirect: '/student/internlist',
          name: 'Student',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'internlist',
              name: 'InternList',
              component: InternList
            },
            {
              path: 'internadd',
              name: 'InternAdd',
              component: InternAdd
            },
            {
              path: 'interndetail',
              name: 'InternDetail',
              component: InternDetail
            }
          ]
        },
        {
          path: 'company',
          redirect: '/company/companyinternlist',
          name: 'Company',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'memberlist',
              name: 'MemberList',
              component: MemberList
            },
            {
              path: 'memberadd',
              name: 'MemberAdd',
              component: MemberAdd
            },
            {
              path: 'companyinternlist',
              name: 'CompanyInternList',
              component: CompanyInternList
            },
            {
              path: 'confirmedinternlist',
              name: 'ConfirmedInternList',
              component: ConfirmedInternList
            },
            {
              path: 'companyinterndetail',
              name: 'CompanyInternDetail',
              component: CompanyInternDetail
            },
            {
              path: 'oldinternlist',
              name: 'OldInternList',
              component: CompanyOldInternList
            }
          ]
        },
        {
          path: 'school',
          redirect: '/school/schoolinternlist',
          name: 'Shcool',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'faculty',
              name: 'Faculty',
              component: Faculty
            },
            {
              path: 'department',
              name: 'Department',
              component: Department
            },
            {
              path: 'student',
              name: 'Student',
              component: Student
            },
            {
              path: 'teacher',
              name: 'Teacher',
              component: Teacher
            },
            {
              path: 'schoolinternlist',
              name: 'SchoolInternList',
              component: SchoolInternList
            },
            {
              path: 'schoolconfirmedinternlist',
              name: 'SchoolConfirmedInternList',
              component: SchoolConfirmedInternList
            },
            {
              path: 'schoolinterndetail',
              name: 'SchoolInternDetail',
              component: SchoolInternDetail
            },
            {
              path: 'companylist',
              name: 'CompanyList',
              component: CompanyList
            }
          ]
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile
        }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render(c) { return c('router-view') }
      },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        }
      ]
    }
  ]
})
