import axios from 'axios';
import toast from 'react-hot-toast';
import { api } from './api'; // Your preconfigured axios instance

interface SignupAuthData {
  name: string | null;
  email: string;
  password: string;
}

interface LogininAuthData {
  email: string;
  password: string;
}

// Signup action for the task tracker
export const signupAction = async (data: SignupAuthData) => {
  try {
    // Call the signup endpoint (adjust the URL as needed)
    const response = await api.post('/auth/signup', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success("SIGNUP_SUCCESS");
    // If a token is returned, store it in localStorage
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  } catch (err: any) {
    toast.error("UNKNOWN_ERROR");
    return err;
  }
};

// Login action for the task tracker
export const loginAction = async (data: LogininAuthData) => {
  try {
    // Call the login endpoint (adjust the URL as needed)
    const response = await api.post('/auth/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
        toast.success("LOGIN_SUCCESS");
        // If a token is returned, store it in localStorage
        if (response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
        }
    }
    else{
        toast.error(response.data.message);
    }
  
    return response;
  } catch (err: any) {
    toast.error("UNKNOWN_ERROR");
    return err;
  }
};

export const fetchLoggedInUserdata = async () => {
  try {
    const response = await api.get('/auth/user');
    console.log('User response:', response.data);
    // Optionally, perform any transformation of response.data if needed.
    return response.data;
  } catch (err: any) {
    console.error("Error fetching user data:", err);
    return null;
  }
};