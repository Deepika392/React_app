import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';

import { RouterProvider, createBrowserRouter,redirect } from "react-router-dom";
import { Dashboard } from './components/Dashboard';

import { AddUser } from './components/AddUser';
import { Category } from './components/Catgeory/Catgeory';

import {AddCategory, AddCatgegory} from './components/Catgeory/AddCatgeory';
import { Product } from './components/Product/Product';
import {Addproduct, AddProuct} from'./components/Product/Addproduct';
import { Login } from './components/Login/Login';

import { Outlet, Navigate } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import { User } from './components/User';
// import { routes } from './routes';

const routes = {
  public: [
    { path: '/', element: <Login /> },
  ],
  SUPERADMIN: [
    { path: '/dashboard', element: <App><Dashboard /></App> },
    { path: '/user', element: <><App><User /></App></> },
    { path: '/product', element:<>
      <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
        <SideBar></SideBar>
        <div className="flex flex-col flex-1">
          <Header></Header>
          <div className="flex-1 p-4 min-h-0 overflow-auto">
            <Product />
          </div>
        </div>
      </div>
    </>  },
    // Additional admin routes
  ],
  SALESADMIN: [
    { path: '/dashboard', element: <App><Dashboard /></App> },
    { path: '/product', element:<App><Product /></App>  },
    // Additional sales admin routes
  ],
};

const ProtectedRoute = () => {
  let token = localStorage.getItem('token');
  token = JSON.parse(token);
  console.log('token',token);
  let userRole ='' ;
  
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true'; 
  if(token)
  {
     userRole = token.role; 
  }
  
  
  const allowedRoutes = userRole ? routes[userRole] : routes.public;

  // if (!token) {
  //   console.log('am token');
  //   return <Navigate to='/' replace />;
  
  // } else {
  //   console.log('out sidre token');
  //   return allowedRoutes;
  // }
  return allowedRoutes;
};

const roleRoute = ProtectedRoute();

const routerArray = [
 
    {
      path:"/",
      element:<Login />
    },
    {
     path: "dashboard",
     element: <App></App>,
     
     children: roleRoute
  }
  

];



const router = createBrowserRouter(roleRoute);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

reportWebVitals();
