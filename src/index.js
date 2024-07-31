// //index.js
// import React, { Children } from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { Header } from './components/Header';
// import { SideBar } from './components/SideBar';


// import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
// import { Dashboard } from './components/Dashboard';

// import { AddUser } from './components/AddUser';
// import { Category } from './components/Catgeory/Catgeory';

// import { AddCatgegory } from './components/Catgeory/AddCatgeory';
// import { Product } from './components/Product/Product';
// import { Addproduct } from './components/Product/Addproduct';
// import { Login } from './components/Login/Login';

// import { User } from './components/User';
// import { Role } from './components/Role/Role';
// import { Addrole } from './components/Role/Addrole';
// import { Addpermission } from './components/Permission/Addpermission';
// import { Permission } from './components/Permission/Permission';
// import { getPermissionByRole } from './components/common/api';
// import { ModuleAccess } from './components/ModuleAccess'

// const permissionData = await getPermissionByRole()

// let commonRouteData = [
//   {
//     path: '/dashboard',
//     loader: () => redirect('dashboard'),
//   },
//   {
//     path: "dashboard",
//     element: <Dashboard />
//   }


// ];
// let roleName = '';

// const newCommonRouteData = permissionData
//   .map(data => {
//     roleName = data.roleName;
//     let element;
//     if (data.route_elm && data.rpath != null) {
//       if (data.route_path === 'role') {
//         element = <Role />;
//       } else if (data.route_path === 'addrole') {

//         element = <Addrole />;
//       } else if (data.route_path === 'addrole/:roleId') {

//         element = <Addrole />;
//       } else if (data.route_path === 'category') {

//         element = <Category />;
//       } else if (data.route_path === 'addcategory') {

//         element = <AddCatgegory />;
//       } else if (data.route_path === 'addcategory/:catId') {

//         element = <AddCatgegory />;
//       } else if (data.route_path === 'Permission') {

//         element = <Permission />;
//       } else if (data.route_path === 'addpermission') {

//         element = <Addpermission />;
//       } else if (data.route_path === 'addpermission/:permissionId') {

//         element = <Addpermission />;
//       } else if (data.route_path === 'user') {

//         element = <User />;
//       } else if (data.route_path === 'adduser') {

//         element = <AddUser />;
//       } else if (data.route_path === 'adduser/:userId') {

//         element = <AddUser />;
//       }
//       else if (data.route_path === 'product') {

//         element = <Product />;
//       } else if (data.route_path === 'addproduct') {

//         element = <Addproduct />;
//       } else if (data.route_path === 'addproduct/:productId') {

//         element = <Addproduct />;
//       }
//     }
//     else {

//       element = <ModuleAccess />
//     }


//     return {
//       path: data.route_path,
//       element: element
//     };
//   })

// let routeData = [
//   ...commonRouteData,
//   ...newCommonRouteData
// ];
// console.log('roleName11', roleName);

// let routes = {
//   public: [
//     { path: '/', element: <Login /> },
//   ],
//   SUPERADMIN:
//     [
//       {
//         path: "/",
//         element: <Login />
//       },
//       {
//         path: "dashboard",
//         element: <App></App>,
//         children: routeData
//       }
//     ],
//   SALESADMIN: [
//     {
//       path: "/",
//       element: <Login />
//     },
//     {
//       path: "dashboard",
//       element: <App></App>,

//       children: routeData
//     },
//     {
//       path: '*',
//       element: <Login />
//     }
//   ],
//   REPORTADMIN: [
//     {
//       path: "/",
//       element: <Login />
//     },
//     {
//       path: "dashboard",
//       element: <App></App>,

//       children: routeData
//     },
//     {
//       path: '*',
//       element: <Login />
//     }
//   ],
//   USERADMIN: [
//     {
//       path: "/",
//       element: <Login />
//     },
//     {
//       path: "dashboard",
//       element: <App></App>,

//       children: routeData
//     },
//     {
//       path: '*',
//       element: <Login />
//     }
//   ],
// };
// console.log('routes', routes);
// const ProtectedRoute = () => {
//   let token = localStorage.getItem('token');
//   token = JSON.parse(token);
//   let userRole = '';


//   const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
//   if (token) {
//     userRole = token.role;
//   }

//   const allowedRoutes = userRole ? routes[userRole] : routes.public;
//   return allowedRoutes;
// };

// const roleRoute = ProtectedRoute();


// const router = createBrowserRouter(roleRoute);
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <RouterProvider router={router}></RouterProvider>
//   </React.StrictMode>
// );

// reportWebVitals();


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import { Dashboard } from './components/Dashboard';
import { AddUser } from './components/AddUser';
import { Category } from './components/Catgeory/Catgeory';
import { AddCatgegory } from './components/Catgeory/AddCatgeory';
import { Product } from './components/Product/Product';
import { Addproduct } from './components/Product/Addproduct';
import { Login } from './components/Login/Login';
import { User } from './components/User';
import { Role } from './components/Role/Role';
import { Addrole } from './components/Role/Addrole';
import { Addpermission } from './components/Permission/Addpermission';
import { Permission } from './components/Permission/Permission';
import { getPermissionByRole } from './components/common/api';
import { ModuleAccess } from './components/ModuleAccess';

async function getRoutes() {
    const permissionData = await getPermissionByRole();

    // Determine the roleName from permissionData
    const roleName = permissionData.length ? permissionData[0].roleName : 'public';
console.log('roleName',roleName);
    let commonRouteData = [
        {
            path: '/dashboard',
            loader: () => redirect('dashboard'),
        },
        {
            path: "dashboard",
            element: <Dashboard />
        }
    ];

    const newCommonRouteData = permissionData.map(data => {
        let element;

        if (data.route_elm && data.rpath != null) {
          if (data.route_path === 'role') {
            element = <Role />;
          } else if (data.route_path === 'addrole') {
    
            element = <Addrole />;
          } else if (data.route_path === 'addrole/:roleId') {
    
            element = <Addrole />;
          } else if (data.route_path === 'category') {
    
            element = <Category />;
          } else if (data.route_path === 'addcategory') {
    
            element = <AddCatgegory />;
          } else if (data.route_path === 'addcategory/:catId') {
    
            element = <AddCatgegory />;
          } else if (data.route_path === 'Permission') {
    
            element = <Permission />;
          } else if (data.route_path === 'addpermission') {
    
            element = <Addpermission />;
          } else if (data.route_path === 'addpermission/:permissionId') {
    
            element = <Addpermission />;
          } else if (data.route_path === 'user') {
    
            element = <User />;
          } else if (data.route_path === 'adduser') {
    
            element = <AddUser />;
          } else if (data.route_path === 'adduser/:userId') {
    
            element = <AddUser />;
          }
          else if (data.route_path === 'product') {
    
            element = <Product />;
          } else if (data.route_path === 'addproduct') {
    
            element = <Addproduct />;
          } else if (data.route_path === 'addproduct/:productId') {
    
            element = <Addproduct />;
          }
        }
        else {
         
          element = <ModuleAccess />
        }
        
        return {
            // path: data.route_path,
            path: data && data.route_path != null ? data.route_path : '*',
            element: element
        };
    });
    let noAccessRouteData = [
      {
        path: "*",
        element : <ModuleAccess />
      }
  ];


console.log('newCommonRouteData',newCommonRouteData);
    const routes = {
        public: [
            { path: '/', element: <Login /> },
        ],
        [roleName]: [
            {
                path: "/",
                element: <Login />
            },
            {
                path: "dashboard",
                element: <App />,
                children: [...commonRouteData, ...newCommonRouteData, ...noAccessRouteData]
            }
            
        ]
    };

    return routes[roleName] || routes.public;
}

async function main() {
    const roleRoutes = await getRoutes();
    const router = createBrowserRouter(roleRoutes);

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );

    reportWebVitals();
}

main();
