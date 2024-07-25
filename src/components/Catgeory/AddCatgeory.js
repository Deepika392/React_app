import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export function AddCatgegory() {
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
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/${catId}`);
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
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/category`, {
                categoryName: catgeoryname,
            });
            if (response.statusText == "Created") {
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
        try{
            const catData = {
                categoryName: catgeoryname,
            }
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/category/${catId}`, catData);
            if (response.statusText == "OK") {
                Swal.fire({
                    icon: 'success',
                    title: 'Category updated',
                    text: 'Category updated successfully',
                }).then(() => {
                    navigate("/dashboard/category");
                });
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again later.',
                });
            }
                
        }catch(error){
            console.error('Error:', error);
        }
    }
    
    return (
        <>
            <div className="container mx-auto p-4">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={collectData}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstrname">
                            Category Name
                        </label>
                        <input
                             className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${categoryError ? 'border-red-500' : ''}`}
                            id="firstrname"
                            type="text"  value={catgeoryname}
                            placeholder="Enter Category"  onChange={(e) => setCatgeoryname(e.target.value)}
                        />
                        {categoryError && (
                            <p className="text-red-500 text-xs italic">{categoryError}</p>
                        )}
                    </div>
                

                    <div className="flex items-center  space-x-4">
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
