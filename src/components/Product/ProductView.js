import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function ProductView() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Field
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Product Name</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productName}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Description</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.description}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Price</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Category</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.Category.categoryName}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Image</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.image ? (
                                <img
                                    src={`${process.env.REACT_APP_IMAGE_URL}/${product.image}`}
                                    alt={product.productName}
                                    className="w-thumbnail h-thumbnail object-cover rounded-lg"
                                />
                            ) : (
                                <img
                                    src={`${process.env.REACT_APP_IMAGE_URL}/no_image.png`}
                                    alt={product.productName}
                                    className="w-300 h-168  object-cover rounded-lg"
                                />
                            )}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="mt-6 flex space-x-4">
                    <Link
                        to={`/dashboard/addproduct/${productId}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Edit
                    </Link>
                    <Link
                        to="/dashboard/product"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
