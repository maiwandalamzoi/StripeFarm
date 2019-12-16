/**
 * The role class can be instanciated to create a role.
 * It shows which variables role has, and which functies the class provides.
 * @param name: this is the name of the role.
 */
export class Role {
    name: 'user'|'farm_admin'|'farmer'|'researcher';
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(name: 'user'|'farm_admin'|'farmer'|'researcher') {
        this.name = name;
    }
    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: RoleJSON): Role {
        let role = Object.create(Role.prototype);
        return Object.assign(role, json);
    }
}
/**
 * This interface represent roleJSON object.
 */
interface RoleJSON {
    name: string;
}
