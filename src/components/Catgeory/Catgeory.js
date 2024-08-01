import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { checkModulePermission } from './../common/api';

export function Category() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(Number(process.env.REACT_APP_PAGE_SIZE)); // Initialize with environment variable
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [canWrite, setCanWrite] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);

    useEffect(() => {
        const fetchPermissionAndCategories = async () => {
            try {
                // Fetch permissions for the module
                let moduleId = 5;
                const permissionData = await checkModulePermission(moduleId);

                // Set the write permission based on fetched permission data
                setCanWrite(permissionData.can_write === 1);
                setCanEdit(permissionData.can_edit === 1);
                setCanDelete(permissionData.can_delete === 1);

                // Fetch categories after setting the permission
                await fetchCategories();
            } catch (error) {
                console.error('Error fetching permissions or categories:', error);
            }
        };

        fetchPermissionAndCategories();
    }, [currentPage, pageSize, searchTerm]);

    async function fetchCategories() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/category`);
            const totalCategories = response.data.length;
            setTotalPages(Math.ceil(totalCategories / pageSize));

            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalCategories);

            const filteredCategories = response.data.filter(category =>
                category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const categoriesForCurrentPage = filteredCategories.slice(startIndex, endIndex);
            setCategories(categoriesForCurrentPage);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (catId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you really want to delete?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
            });

            if (result.isConfirmed) {
                // Check if there are products associated with this category
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/category/${catId}`);

                if (response.data.length > 0) {
                    // If products are found, confirm deletion with user
                    const confirmDelete = await Swal.fire({
                        title: 'Products are associated',
                        text: 'Do you want to delete them along with the category?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Delete all',
                        cancelButtonText: 'Cancel',
                    });

                    if (confirmDelete.isConfirmed) {
                        // Delete products first
                        await deleteProducts(response.data.map(product => product.id));
                        // Then delete the category
                        await deleteCategory(catId);
                    } else {
                        // If user cancels, do nothing
                        return false;
                    }
                } else {
                    // Delete category if no associated products
                    await deleteCategory(catId);
                }

                // Show success message after deletion
                Swal.fire('Deleted!', 'Your category has been deleted.', 'success');
            } else {
                // If user clicks Cancel or outside the modal
                Swal.fire('Cancelled', 'Your category is safe :)', 'info');
            }
        } catch (error) {
            console.error('Error checking products or deleting category:', error);
            Swal.fire('Error', 'There was an error processing your request.', 'error');
        }
    };

    const deleteProducts = async (products) => {
        try {
            const deleteRequests = products.map(productId => axios.delete(`${process.env.REACT_APP_API_URL}/product/${productId}`));
            await Promise.all(deleteRequests);
        } catch (error) {
            console.error('Error deleting products:', error);
            Swal.fire('Error', 'Failed to delete products.', 'error');
        }
    };

    const deleteCategory = async (catId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/category/${catId}`);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Category deleted successfully',
            }).then(() => {
                // Fetch updated category list or perform any necessary action
                fetchCategories();
            });
        } catch (error) {
            console.error('Error deleting category:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error deleting category: ${error.message}`,
            });
        }
    };

    const columns = [
        {
            name: 'Category Name',
            selector: 'categoryName',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.categoryName}</div>
        },
        (canEdit || canDelete) && { // Conditionally add the "Actions" column
            name: 'Actions',
            cell: row => (
                <div className="flex">
                    {canEdit && (

                        <Link to={`/dashboard/addcategory/${row.id}`} className="mr-2 text-blue-500 hover:text-blue-700">
                            <FaEdit className="text-xl" />
                        </Link>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => handleDelete(row.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FaTrash className="text-xl" />
                        </button>
                    )}
                </div>
            )
        }
    ].filter(column => column !== false); // Filter out any false values

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
                <h1 className="p-4 mr-4 text-3xl font-bold">Category</h1>
                <div className="p-4">
                    {canWrite && (
                        <Link to='/dashboard/addcategory'>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add Category
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Category Name"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <DataTable
                columns={columns}
                data={categories}
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
    );
}
