import { FcBullish } from "react-icons/fc";
import { Link } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineViewGridAdd,
  HiOutlinePlusSm
} from 'react-icons/hi';
import React, { useState, useEffect } from 'react';
import { getPermissionByRole } from './../components/common/api'; // API call to fetch permissions

const linkClass =
  'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base';

export function SideBar() {
  const [links, setLinks] = useState([]);

let dashboardLinks = [{
  key: 'dashboard',
  label: 'Dashboard',
  path: '/dashboard',
  icon: <HiOutlineViewGrid />
}];

  useEffect(() => {

 
    const fetchPermissions = async () => {
      try {
        const permissions = await getPermissionByRole();
       
         const sidebarLinks = await mapPermissionsToLinks(permissions);
      
        setLinks([...dashboardLinks,...sidebarLinks]);
      } catch (err) {
        console.error('Error fetching sidebar permissions:', err);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <div className="bg-neutral-900 w-60 p-3 flex flex-col text-white">
      <div className="flex items-center gap-2 px-1 py-3">
        <FcBullish fontSize={30} />
        <span className="text-neutral-100">User Management</span>
      </div>
      <div className="flex-1">
        {links.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}
      </div>
    </div>
  );
}

function SidebarLink({ link }) {
  return (
    <Link to={link.path} className={linkClass}>
      <span className="text-xl">{link.icon}</span>
      {link.label}
    </Link>
  );
}

function mapPermissionsToLinks(permissions) {
  // Map permissions to sidebar links
  return permissions.map(permission => {
    if (permission.route_elm && permission.rpath != null) {
    switch (permission.route_path) {
      case 'dashboard':
        return {
          key: 'dashboard',
          label: 'Dashboard',
          path: '/dashboard',
          icon: <HiOutlineViewGrid />
        };
      case 'role':
        return {
          key: 'role',
          label: 'Role',
          path: '/dashboard/role',
          icon: <HiOutlinePlusSm />
        };
      case 'Permission':
        return {
          key: 'permission',
          label: 'Permission',
          path: '/dashboard/permission',
          icon: <HiOutlinePlusSm />
        };
      case 'user':
        return {
          key: 'users',
          label: 'Users',
          path: '/dashboard/user',
          icon: <HiOutlineUsers />
        };
      case 'category':
        return {
          key: 'category',
          label: 'Category',
          path: '/dashboard/category',
          icon: <HiOutlineViewGridAdd />
        };
      case 'product':
        return {
          key: 'product',
          label: 'Product',
          path: '/dashboard/product',
          icon: <HiOutlinePlusSm />
        };
      default:
        return null;
    }
  }
  }).filter(link => link !== null); // Filter out any null values
}
