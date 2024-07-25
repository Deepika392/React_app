import logo from './logo.svg';
import './App.css';
import { Outlet } from "react-router-dom";
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';
import { Dashboard } from './components/Dashboard';

import { Login } from './components/Login/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { User } from './components/User';
import React, { useState, useEffect } from 'react';

export default function App() {
  // const [token, setToken] = useState('');
  // useEffect(() => {
  //   // Retrieve username from localStorage on component mount
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setToken(token);
  //   }
  // }, []);

 
  return (

    <>
      <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
        <SideBar></SideBar>
        <div className="flex flex-col flex-1">
          <Header></Header>
          <div className="flex-1 p-4 min-h-0 overflow-auto">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>

  );
}




