import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import api from './../utils/api';

export function AddCatgegory() {
    let authToken = localStorage.getItem('authToken')
    const navigate = useNavigate();
    const [catgeoryname, setCatgeoryname] = useState('');
    const [categoryError, setCategoryError] = useState('');
    
    const { catId } = useParams();

    useEffect(() => {
        if (catId) {
          fetchCatgeory(catId);
        }
    }, [catId]);

    const fetchCatgeory = async (catId) => {
        try {
        const response =   await api.get(`/category/${catId}`);
          setCatgeoryname(response.data.categoryName);
         
        } catch (error) {
          console.error('Error fetching category:', error);
        }
    };

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        if (!catgeoryname.trim()) {
            errors.categoryname = "Category name is required";
            formIsValid = false;
        } if (catgeoryname && catgeoryname.length > 100) {
            errors.categoryname = "Category name must be less than 100 characters";
            formIsValid = false;
        }

        setCategoryError(errors.categoryname || '');

        return formIsValid;
    };

    async function collectData(e) {
        e.preventDefault();
    
        const isValid = validateForm();
    
        if (isValid) {
            if (!catId) {
                addCategory();
            } else {
                updateCategory(catId);
            }
        }
    }
    
    async function addCategory() {
        try {
            const response = await api.post('/category', {
                categoryName: catgeoryname,
            });

            if (response.statusText === "Created") {
                Swal.fire({
                    icon: 'success',
                    title: 'Category Added',
                    text: 'Category registered successfully',
                }).then(() => {
                    navigate("/dashboard/category");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again later.',
                });
            }

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again later.',
            });
        }
    }

    async function updateCategory(catId){
        try {
            const catData = {
                categoryName: catgeoryname,
            }
            
            const response =   await api.put(`/category/${catId}`,catData);
            if (response.statusText === "OK") {
                Swal.fire({
                    icon: 'success',
                    title: 'Category updated',
                    text: 'Category updated successfully',
                }).then(() => {
                    navigate("/dashboard/category");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again later.',
                });
            }
                
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    return (
        <>
            <div className="container mx-auto p-4">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={collectData}>
                    <div className="relative mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryname">
                            Category Name
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${categoryError ? 'border-red-500' : ''}`}
                            id="categoryname"
                            type="text"
                            value={catgeoryname}
                            placeholder="Enter Category"
                            onChange={(e) => setCatgeoryname(e.target.value)}
                            maxLength={100}
                        />
                        <p className="absolute top-1 right-0 text-gray-600 text-xs mt-1 mr-3">
                            {catgeoryname.length}/100 
                        </p>
                        {categoryError && (
                            <p className="text-red-500 text-xs italic mt-2">{categoryError}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            {catId ? 'Update Category' : 'Add Category'}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => navigate("/dashboard/category")}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
