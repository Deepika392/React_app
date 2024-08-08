import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import api from './../utils/api';

export function Addproduct() {
    let authToken = localStorage.getItem('authToken')
    const navigate = useNavigate();
    const { productId } = useParams();

    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    const [productname, setProductname] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const [image, setImage] = useState(null); // State for image file
    const [imagePreview, setImagePreview] = useState(null); // State for image preview
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (productId) {
            fetchProduct(productId);
        }
        fetchCategory();
    }, [productId]);

    async function fetchCategory() {
        try {
            const response = await api.get('/category');
            setOptions(response.data);
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    }

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const fetchProduct = async (productId) => {
        try {
            const response =   await api.get(`/product/${productId}`);
            setProductname(response.data.productName);
            setDescription(response.data.description);
            setPrice(response.data.price);
            setSelectedOption(response.data.categoryId);
            if (response.data.image) {
                const imageUrl = `${process.env.REACT_APP_IMAGE_URL}/${response.data.image}`;
                setImagePreview(imageUrl);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (allowedTypes.includes(file.type)) {
                setImage(file);
                setImagePreview(URL.createObjectURL(file)); // Preview selected image

              
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Please select a file of type JPEG, JPG, PNG, or GIF.',
                });
                e.target.value = null; // Clear the input
            }
        }
    };

    const validateForm = () => {
        let errors = {};

        if (!productname.trim()) {
            errors.productname = "Product name is required";
        } else if (productname.length > 100) {
            errors.productname = "Product name cannot exceed 100 characters";
        }

        if (!description.trim()) {
            errors.description = "Description is required";
        } else if (description.length > 250) {
            errors.description = "Description cannot exceed 250 characters";
        }

        if (!price) {
            errors.price = "Price is required";
        } else if (isNaN(price)) {
            errors.price = "Price must be a number";
        }

        if (!selectedOption) {
            errors.selectedOption = "Category is required";
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    async function collectData(e) {
        e.preventDefault();

        const isValid = validateForm();

        if (isValid) {
            if (productId === undefined) {
                addproduct();
            } else {
                updateProduct(productId);
            }
        }
    }

    async function addproduct() {
        try {
            const formData = new FormData();
            formData.append('productName', productname);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('categoryId', selectedOption);
            if (image) {
                formData.append('image', image);
            }

            const response = await api.post('/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            });
            if (response.statusText === "Created") {
                Swal.fire({
                    icon: 'success',
                    title: 'Product Added',
                    text: 'Product registered successfully',
                }).then(() => {
                    navigate("/dashboard/product");
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

    async function updateProduct(productId) {
        try {
            const formData = new FormData();
            formData.append('productName', productname);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('categoryId', selectedOption);
            if (image) {
                formData.append('image', image);
            }
            
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/product/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                     'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json'
                },
            });
         
            if (response.statusText === "OK") {
                Swal.fire({
                    icon: 'success',
                    title: 'Product updated',
                    text: 'Product updated successfully',
                }).then(() => {
                    navigate("/dashboard/product");
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productname">
                            Product Name
                        </label>
                        <div className="relative">
                            <input
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productname ? 'border-red-500' : ''}`}
                                id="productname"
                                type="text"
                                value={productname}
                                placeholder="Enter product name"
                                onChange={(e) => setProductname(e.target.value)}
                                maxLength="100" // Restrict input length
                            />
                            <p className="absolute top-0 right-0 text-gray-600 text-xs mt-2 mr-3">
                                {productname.length}/100 characters
                            </p>
                        </div>
                        {errors.productname && <p className="text-red-500 text-xs italic">{errors.productname}</p>}
                    </div>
                    {imagePreview && (
                        <div className="mb-4">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-[300px] h-[168px] object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Image
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="image"
                            type="file"  
                            accept=".jpeg, .jpg, .png, .gif" // Restrict file types
                            onChange={handleImageChange}
                        />
                        {/* {errors.image && (
                            <p className="text-red-500 text-xs italic">{errors.image}</p>
                        )} */}
                    </div>
                    <div className="relative mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <div className="relative">
                            <input
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : ''}`}
                                id="description"
                                type="text"
                                value={description}
                                placeholder="Enter Description"
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength="250" // Restrict input length
                            />
                            <p className="absolute top-0 right-0 text-gray-600 text-xs mt-2 mr-3">
                                {description.length}/250 characters
                            </p>
                        </div>
                        {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                            Price
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.price ? 'border-red-500' : ''}`}
                            id="price"
                            type="number"
                            value={price}
                            placeholder="Enter Price"
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        {errors.price && <p className="text-red-500 text-xs italic">{errors.price}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                            Category
                        </label>
                        <select
                            value={selectedOption}
                            onChange={handleSelectChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.selectedOption ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select an option</option>
                            {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.categoryName}
                                </option>
                            ))}
                        </select>
                        {errors.selectedOption && (
                            <p className="text-red-500 text-xs italic">{errors.selectedOption}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                            type="submit"
                        >
                            {productId ? 'Update Product' : 'Add Product'}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => navigate("/dashboard/product")}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
