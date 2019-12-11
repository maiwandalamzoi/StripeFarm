/*
* General utils for managing cookies in Typescript.
*/
export function setCookie(name: string, val: string, userId: number) {
    name = name + ':' + userId.toString();
    const date = new Date();
    const value = val;

    // Set it expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"="+value+"; expires="+date.toUTCString()+"; path=/";
}

export function getCookie(name: string, userId: number) {
    name = name + ':' + userId.toString();
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length === 2) {
        let par = parts.pop();
        if (par !== undefined){
            return par.split(";").shift();
        } else {
            return undefined;
        }
    }
}

export function deleteCookie(name: string, userId: number) {
    name = name + ':' + userId.toString();
    const date = new Date();

    // Set it expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}
