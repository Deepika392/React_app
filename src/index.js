import React, { Children } from 'react';
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

import { User } from './components/User';


let routes = {
  public: [
    { path: '/', element: <Login /> },
  ],
  SUPERADMIN: 
  [
    {
      path:"/",
      element:<Login />
    },
    {
     path: "dashboard",
     element: <App></App>,
    
    
     children: [
      {
        path:'/dashboard',
        loader: () => redirect('dashboard'),
      },
      {
        path:"dashboard", 
        element:<Dashboard />
      },
      {
        path: "user",
        element: <User />
      },
      {
        path: "adduser",
        element: <AddUser />
      },
      {
        path:"adduser/:userId",
        element: <AddUser />
      },
      {
        path: "category",
        element: <Category />
      },
      {
        path:"addcategory",
        element: <AddCatgegory />
      },
      {
        path:"addcategory/:catId",
        element: <AddCatgegory />
      },
      {
        path:"product",
        element: <Product />
      },
      {
        path:"addproduct",
        element: <Addproduct />
      },
      {
        path:"addproduct/:productId",
        element: <Addproduct />
      },
    ]
  }
],
  SALESADMIN:  [
    {
      path:"/",
      element:<Login />
    },
    {
     path: "dashboard",
     element: <App></App>,
     
     children: [
      {
        path:'/dashboard',
        loader: () => redirect('dashboard'),
      },
      {
        path:"dashboard", 
        element:<Dashboard />
      },
      {
        path: "category",
        element: <Category />
      },
      {
        path:"addcategory",
        element: <AddCatgegory />
      },
      {
        path:"addcategory/:catId",
        element: <AddCatgegory />
      },
      {
        path:"product",
        element: <Product />
      },
      {
        path:"addproduct",
        element: <Addproduct />
      },
      {
        path:"addproduct/:productId",
        element: <Addproduct />
      },
      
    ]
  },
  {
    path:'*',
    element: <Login />
  }
],
};

const ProtectedRoute = () => {
  let token = localStorage.getItem('token');
  token = JSON.parse(token);
  let userRole ='' ;
  
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true'; 
  if(token)
  {
     userRole = token.role; 
  }
  
  const allowedRoutes = userRole ? routes[userRole] : routes.public;
  return allowedRoutes;
};

const roleRoute = ProtectedRoute();


const router = createBrowserRouter(roleRoute);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

reportWebVitals();
