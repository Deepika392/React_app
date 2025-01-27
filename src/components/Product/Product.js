import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function Product() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(Number(process.env.REACT_APP_PAGE_SIZE)); // Initialize with environment variable
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [currentPage, pageSize, searchTerm]); // Include searchTerm in dependencies to trigger search on change

    async function fetchProducts() {
        try {
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/`);
            const totalProducts = response.data.length;
            setTotalPages(Math.ceil(totalProducts / pageSize));

            const filteredProducts = response.data.filter(product =>
                product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.price.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.Category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalProducts);

            const productsForCurrentPage = filteredProducts.slice(startIndex, endIndex);
            setProducts(productsForCurrentPage);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (productId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this product!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
          
                await axios.delete(`${process.env.REACT_APP_API_URL}/product/${productId}`);
                Swal.fire(
                    'Deleted!',
                    'Product has been deleted.',
                    'success'
                );
                fetchProducts(); // Refresh products after deletion
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            Swal.fire(
                'Error!',
                'Failed to delete product.',
                'error'
            );
        }
    };

    const columns = [
        {
            name: 'Image',
            selector: 'image',
            sortable: false,
            cell: row => (
                <div className="text-gray-600">
                    {row.image ? (
                        <img
                            src={`${process.env.REACT_APP_IMAGE_URL}/${row.image}`}
                            alt={row.productName}
                            className="w-16 h-16  mr-4  mt-4"
                        />
                    ) : (
                        <img
                            src={`${process.env.REACT_APP_IMAGE_URL}/no_image.png`}
                            alt={row.productName}
                            className="w-16 h-16 mt-4  mr-4"
                        />
                    )}
                </div>
            )
        },
        {
            name: 'Category',
            selector: 'Category.categoryName',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.Category.categoryName}</div>
        },
        {
            name: 'Product Name',
            selector: 'productName',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.productName}</div>
        },
        {
            name: 'Description',
            selector: 'description',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.description}</div>
        },
        {
            name: 'Price',
            selector: 'price',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.price}</div>
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex">
                    <Link to={`/dashboard/addproduct/${row.id}`} className="mr-2 text-blue-500 hover:text-blue-700">
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
        <div className="container mx-auto p-4">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <h1 className="p-4 mr-4 text-3xl font-bold">Products</h1>
                <div className="p-4">
                    <Link to='/dashboard/addproduct'>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Product
                        </button>
                    </Link>
                </div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Product Name, Category, Description, Price"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                customStyles={customStyles}
            />
        </div>
    );
}
