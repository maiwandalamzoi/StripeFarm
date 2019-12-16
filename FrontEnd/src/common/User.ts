/**
 * The user class can be instanciated to create a user.
 * It shows which variables user has, and which functies the class provides.
 * @param id: this is the id user.
 * @param email: this is the email of the user.
 * @param first_name: this is the first name of the user.
 * @param last_name: this is the last name of the user.
 * @param password: this is the password of the user.
 * @param created_date: this is the date on which the account was created
 */
export default class User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    password: string | undefined;
    created_date: string | undefined;
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(userId: number|undefined, email: string, firstName: string, lastName: string, password?: string, createdDate?: string) {
        this.id = userId || -1;
        this.email = email;
        this.first_name = firstName;
        this.last_name = lastName;
        this.password = password;
        this.created_date = createdDate;
    }
    /**
     * toRow(): this function transforms the userinto a format that can be used to create the row of a table.
     */
    public toRow(roleName: string) {
        return {id: this.id, email: this.email, firstName: this.first_name, lastName: this.last_name, createdDate: this.created_date, role: roleName};
    }
    /**
     * toJSON(): this function tries to transform the current object into a JSON object
     */
    toJSON() {
        return {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            password: this.password
        }
    }
    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: UserJSON): User {
        let user = Object.create(User.prototype);
        return Object.assign(user, json);
    }
}
/**
 * This interface represent userJSON object.
 */
interface UserJSON {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_date: string;
}
