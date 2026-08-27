// import { createBrowserRouter } from 'react-router-dom'
// import AuthLayout from '../layouts/AuthLayout'
// import Login from '../Pages/auth/Login'
// import Dashboard from '../Pages/admin/Dashboard'

// const router = createBrowserRouter([
//   {
//     element: <AuthLayout />,
//     children: [
//       {
//         path: '/login',
//         element: <Login />,
//       },
//     ],
//   },
//   {
//     path: '/admin',
//     element: <Dashboard />,
//   },
// ])

// export default router


import { createBrowserRouter } from 'react-router-dom'

import AuthLayout from '../layouts/AuthLayout'
import Login from '../Pages/auth/Login'
import Dashboard from '../Pages/admin/Dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    errorElement: <div>Page Not Found</div>,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },

  {
    path: '/admin',
    element: <Dashboard />,
    errorElement: <div>Page Not Found</div>,
  },
])

export default router