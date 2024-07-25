import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function Product() {

    const handleDelete = (catId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this product!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:4000/api/product/${catId}`)
                    .then(() => {
                        Swal.fire(
                            'Deleted!',
                            'Product has been deleted.',
                            'success'
                        );
                        fetchProduct(); 
                    })
                    .catch(error => {
                        console.error('Error deleting Product:', error);
                        Swal.fire(
                            'Error!',
                            'Failed to delete Product.',
                            'error'
                        );
                    });
            }
        });
    };

    const [products, setProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Adjust page size as needed
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [currentPage, pageSize]); // Include pageSize in dependencies to update totalPages correctly

    async function fetchProduct() {
        try {

            const response = await axios.get('http://localhost:4000/api/product');
            // Calculate total pages based on fetched data and pageSize
            const totalProducts = response.data.length;
            setTotalPages(Math.ceil(totalProducts / pageSize));

            // Calculate the start and end index of users to display for the current page
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalProducts);

            // Extract users for the current page
            const usersForCurrentPage = response.data.slice(startIndex, endIndex);
            setProduct(usersForCurrentPage);



        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            name: 'Image',
            selector: 'image',
            sortable: true,
            cell: row => <div className="text-gray-600"> {row.image ? (
                <img
                    src={`http://localhost:4000/uploads/${row.image}`}
                    alt={row.productName}
                    className="w-16 h-16  mr-4  mt-4"
                />
            ) : (
              
                    <img
                    src={`http://localhost:4000/uploads/no_image.png`}
                    alt={row.productName}
                    className="w-16 h-16 mt-4  mr-4"
                />
               
            )}</div>
        },
        {
            name: 'Category',
            selector: 'categoryName',
            sortable: true,
            cell: row => <div className="text-gray-600">{row.Category.categoryName}</div>
        },
        
        {
            name: 'Product',
            selector: 'productName',
            sortable: true,
            cell: row => <div className="text-gray-600">{row.productName}</div>
        },
        {
            name: 'Description',
            selector: 'description',
            sortable: true,
            cell: row => <div className="text-gray-600">{row.description}</div>
        },
        {
            name: 'Price',
            selector: 'price',
            sortable: true,
            cell: row => <div className="text-gray-600">{row.price}</div>
        },

        {
            name: 'Actions',
            cell: row => (
                <div className="flex">
                    <Link to={`/dashboard/addcategory/${row.id}`} className="mr-2 text-blue-500 hover:text-blue-700">
                         <FaEdit className="text-xl" />
                    </Link>
                    <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    <FaTrash className="text-xl" />
                </button>
                </div>
            )
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                textAlign: 'center',
            },
        },
    };
    return (
        <>
            <div className="container mx-auto p-4">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <h1 className="p-4 mr-4 text-3xl font-bold">Product</h1>
                <div className="p-4">
                    <Link to='/dashboard/addproduct'>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Product
                        </button>
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={products}
                pagination
                paginationServer
                paginationTotalRows={totalPages * pageSize}
                paginationPerPage={pageSize}
                paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                    setPageSize(currentRowsPerPage);
                    setCurrentPage(currentPage);
                }}
                paginationDefaultPage={currentPage}
                onChangePage={handlePageChange}
                customStyles={customStyles} // Apply custom styles
            />
        </div>
        </>
    )
}


