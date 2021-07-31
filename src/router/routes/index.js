import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Hate Crime Tracker'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home')),
    meta: {
      menuHidden: true
    }
  },
  {
    path: '/second-page',
    component: lazy(() => import('../../views/SecondPage')),
    meta: {
      menuHidden: true
    }
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/admin',
    component: lazy(() => import('../../views/AdminPage')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
