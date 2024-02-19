import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { jwtDecode }  from "jwt-decode";
import { Navigation, Route } from '../types';
import Swal from 'sweetalert2';
import { NavigationContainerRef } from '@react-navigation/native';

interface AuthContextProps {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
    authTokens: any;
    setAuthTokens: Dispatch<SetStateAction<any>>;
    registerUser: (email: string, username: string, first_name: string, last_name: string, password: string) => void;
    loginUser: (username: string, password: string) => Promise<void>; // Add Promise<void> here
    logoutUser: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
    navigation: Navigation;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export { AuthContext };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, navigation }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens")!)
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens")!)
            : null
    );

    const [loading, setLoading] = useState(true);


    const loginUser = async (username: string, password: string) => {
        const response = await fetch("http://127.0.0.1:8000/user/login/", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                username, password
            })
        });

        const data = await response.json();

        if(response.status === 200){
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            //console.log(data)
            navigation.navigate('Dashboard');
            Swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });

        } else {    
            console.log(response.status);
            console.log("there was a server issue");
            Swal.fire({
                title: "Username or password does not exist",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const registerUser = async (email: string, username: string, first_name: string, last_name: string, password: string) => {
        const response = await fetch("http://127.0.0.1:8000/user/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, username, password, first_name, last_name
            })
        });

        if(response.status === 201){
            navigation.navigate('Dashboard');
            Swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            Swal.fire({
                title: "An Error Occurred " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigation.navigate("LoginScreen");
        Swal.fire({
            title: "You have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    const contextData: AuthContextProps = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    };

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
