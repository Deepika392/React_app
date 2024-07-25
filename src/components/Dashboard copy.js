import { Link } from "react-router-dom";
import { Header } from "./Header";
import { SideBar } from "./SideBar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Dashboard(){
    const [userCount, setUserCount] = useState([]);
    const [catCount, setCatCount] = useState('');
    const [productCount, setProductCount] = useState('');

    useEffect(() => {
       
        fetchCount();
        
      }, []);

    const fetchCount = async (userId) => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/records`);
          setUserCount(response.data.userCount);
          setCatCount(response.data.categoryCount);
          setProductCount(response.data.productCount);
          
        } catch (error) {
          console.error('Error fetching:', error);
        }
    };
    return(
        <>
       
            <div className="container mx-auto mt-8">
            <div className="flex flex-wrap -mx-4">
             
                <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
                <Link to='/dashboard/user'>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">User</h2>
                        <div className="flex items-center justify-center">
                            <div className="text-5xl font-bold text-indigo-600">{userCount}</div>
                        </div>
                    </div>
                    </Link>
                </div>
               

                <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
                <Link to='/dashboard/category'>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Category </h2>
                        <div className="flex items-center justify-center">
                            <div className="text-5xl font-bold text-indigo-600">{catCount}</div>
                        </div>
                    </div>
                    </Link>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
                <Link to='/dashboard/product'>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Product </h2>
                        <div className="flex items-center justify-center">
                            <div className="text-5xl font-bold text-indigo-600">{productCount}</div>
                        </div>
                    </div>
                    </Link>
                </div>
                
            </div>
        </div>
        </>
    )
}