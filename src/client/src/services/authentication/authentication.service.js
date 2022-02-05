import { BehaviorSubject } from 'rxjs';
import {handleResponse} from "./handle-response";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('bupCurrentUser')));

const AUTH_URL = process.env.REACT_APP_SERVER_URL;

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${AUTH_URL}/v1/authentication`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('bupCurrentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('bupCurrentUser');
    currentUserSubject.next(null);
}
