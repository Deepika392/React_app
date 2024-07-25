import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { RouterProvider, createBrowserRouter,redirect } from "react-router-dom";
import { Dashboard } from './components/Dashboard';
import { User } from './components/User';
import { AddUser } from './components/AddUser';
import { Category } from './components/Catgeory/Catgeory';
import { AddCatgegory } from './components/Catgeory/AddCatgeory';
import { Product } from './components/Product/Product';
import { Addproduct } from './components/Product/Addproduct';
import { Login } from './components/Login/Login';

import { Outlet } from "react-router-dom";


const routerArray = [
 
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
  
 

];
const router = createBrowserRouter(routerArray);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
