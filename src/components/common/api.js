import axios from 'axios';

export async function getRole() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/role`);
        let roles = response.data;
        let roleName = [];
        roles.forEach(role => {

            roleName.push(role.roleName);
        });
        return roleName
    } catch (error) {
        console.error('Error fetching Role:', error);
    }
}

export async function getPermissionByRole() {
    try {
        let token = localStorage.getItem('token');
        token = JSON.parse(token);
        let userId = token && token.id ? token.id : 0;
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/permissionByRole`,{
            userId : userId
        });

        const filteredData = response.data.filter(item => item.rpath !== null && item.rpath !== undefined);
       
        return filteredData;
    } catch (error) {
        console.error('Error fetching getPermissionData:', error);
    }
}