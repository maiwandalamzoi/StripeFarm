/* External imports */
import React, { useEffect } from 'react';
import { render } from 'react-dom';

/* Local imports */
import { getUserRoles, getAllUsersOnFarm } from "../../../utils/Controllers/RoleController";
import UserManagementTable from "./EditableMaterialTable";

/*
    Interface that handles the state update to the parent component
    @param id: id of that spcific role
    @param name: name of that specific role
*/
interface role {
    id: any;
    name: string;
}

/*
    Renders the table based on its parent's props values
*/
const CreateUserManagementTable = (props: any) => {
    /*
        userRoles: contains list of user roles
        users: contains list of users to be managed
    */
    var userRoles: any;
    var users: any;

    /*
        fetchData(): fetchData gets all the user roles that are stored in the database and returns them
    */
    async function fetchData() {
        try {
            // get role list
            const roleList = await getUserRoles();
            mapRoles(roleList);

            // get users on farm
            users = await getAllUsersOnFarm(props.farmId);
            users = users.map((e: any) => {
                return {id: e.user_id ,role: e.role.name, email: e.email};
            })

            // render table
            renderTable();
        } catch (error) {
            users = [];
            renderTable();
            console.log(error);
        }
    }

    /*
        mapRoles(): maps all roles to the the existing user roles
    */
    function mapRoles(roles: any) {
        var temp: any = {};
        roles.forEach((r: role) => {
            if(r.name !== "admin") {
                temp[r.name] = r.name;
            }
        })
        userRoles = temp;
    }

    /*
        renderTable(): renders the table based on the column data
    */
    function renderTable() {
        var columns = [
            {title: "Email", field:"email", editable: "onAdd"},
            {title: "Role", field:"role", lookup:userRoles, initialEditValue:["user"]}
        ];
        render(<UserManagementTable columns={columns} data={users} title={"User management table"} farmId={props.farmId}/> , document.getElementById("userManagementTable"))
    }

    /*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.farmId]);

    /*
        Return: return creates the view where the user management table is shown
    */
    return(<div id="userManagementTable"> </div>);
}

export default CreateUserManagementTable;
