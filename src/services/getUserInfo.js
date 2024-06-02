import { jwtDecode } from "jwt-decode";

export function authInfo() {
    var decoded = jwtDecode(sessionStorage.getItem('token'));
    return decoded
}