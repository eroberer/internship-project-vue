import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views - Pages
import Login from '@/views/pages/Login'

import Redirect from '@/views/Redirect'

// Student
import InternList from '@/views/student/InternList'
import InternAdd from '@/views/student/InternAdd'
import InternDetail from '@/views/student/InternDetail'

// Company
import CompanyInternList from '@/views/company/CompanyInternList'
import CompanyInternDetail from '@/views/company/CompanyInternDetail'
import ConfirmedInternList from '@/views/company/ConfirmedInternList'
import MemberList from '@/views/company/MemberList'
import MemberAdd from '@/views/company/MemberAdd'

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
            }
          ]
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
