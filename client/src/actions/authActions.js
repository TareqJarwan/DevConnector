import axios from 'axios';
import {GET_ERRORS, SET_CURRENT_USER} from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';


// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Login - Get User Token
export const loginUser = (userData) => dispatch => {
    axios
        .post('/api/users/login', userData)
        .then(res => {
            // Save to localStorage
            const {token} = res.data;
            // Set token to ls
            localStorage.setItem('jwtToken', token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode Token to get user date
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token form the localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));

};

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
};

