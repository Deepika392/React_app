import axios from 'axios';

export async function getRole() {
    try {
        let authToken = localStorage.getItem('authToken')
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/role` ,{
            headers: {
                'Authorization': `Bearer ${authToken}`, 
                'Content-Type': 'application/json'
            }
        }
        );
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
        let authToken = localStorage.getItem('authToken')
        let token = localStorage.getItem('token');
        token = JSON.parse(token);
        let userId = token && token.id ? token.id : 0;
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/permissionByRole`,{
            userId : userId
        } ,{
            headers: {
                'Authorization': `Bearer ${authToken}`, 
                'Content-Type': 'application/json'
            }
        });

        const filteredData = response.data.filter(item => item.rpath !== null && item.rpath !== undefined);
       
        return filteredData;
    } catch (error) {
        console.error('Error fetching getPermissionData:', error);
    }
}

export async function checkModulePermission(moduleId){
    try{
        let token = localStorage.getItem('token');
        token = JSON.parse(token);
        let userId = token && token.id ? token.id : 0;
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/checkModulePermission`,{
            userId : userId,
            moduleId : moduleId
        });
      return response.data;
    }catch (error) {
        console.error('Error fetching checkModulePermission:', error);
    }
}


export async function checkDashboardPermission(){
    try{
        let authToken = localStorage.getItem('authToken')
        let token = localStorage.getItem('token');
        token = JSON.parse(token);
        let userId = token && token.id ? token.id : 0;
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/checkDashboardPermission`,{
            userId : userId,
        } ,{
            headers: {
                'Authorization': `Bearer ${authToken}`, 
                'Content-Type': 'application/json'
            }
        }
        );
      return response.data;
    }catch (error) {
        console.error('Error fetching checkModulePermission:', error);
    }
}