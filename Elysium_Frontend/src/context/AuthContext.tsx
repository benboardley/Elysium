import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { jwtDecode } from "jwt-decode";
import { Platform } from 'react-native';
import SensitiveInfo from 'react-native-sensitive-info';
import Swal from 'sweetalert2';
import { Navigation, Route } from '../utils/types';
import { useCookies } from 'react-cookie';
import { setCurrentScreen } from './currentScreen';

interface AuthContextProps {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
    authTokens: any;
    setAuthTokens: Dispatch<SetStateAction<any>>;
    registerUser: (email: string, username: string, first_name: string, last_name: string, password: string) => void;
    loginUser: (username: string, password: string) => Promise<void>;
    logoutUser: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
    navigation: Navigation;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export { AuthContext };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, navigation }) => {
    const [authTokens, setAuthTokens] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['authTokens', 'currentScreen']);

    const retrieveTokens = async () => {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
            try {
                const storedTokens = await SensitiveInfo.getItem("authTokens", {});
                if (storedTokens) {
                    setAuthTokens(JSON.parse(storedTokens));
                    setUser(jwtDecode(JSON.parse(storedTokens).access));
                }
            } catch (error) {
                console.error("Error retrieving tokens from SensitiveInfo:", error);
            }
        } else {
            //const storedTokens = localStorage.getItem("authTokens");
            const storedTokens = cookies['authTokens'];
            //console.log(storedTokens)
            if (storedTokens) {
                setAuthTokens(JSON.parse(JSON.stringify(storedTokens))); // Convert to string and then parse
                setUser(jwtDecode(storedTokens.access));
            }
        }
        setLoading(false);
    };

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
            navigation.navigate('MainScreen', { screen: 'Dashboard' });
            if (Platform.OS === 'android' || Platform.OS === 'ios') {
                await SensitiveInfo.setItem("authTokens", JSON.stringify(data), {});
            } else {
                //localStorage.setItem("authTokens", JSON.stringify(data));
                setCookie('authTokens', JSON.stringify(data), { path: '/' });
            }
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
            navigation.navigate('LoginScreen');
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
        console.log(JSON.stringify({email, username, password, first_name, last_name}))

        if(response.status === 201){
            //navigation.navigate('LoginScreen');
            Swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
            loginUser(username, password);
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
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
            SensitiveInfo.deleteItem("authTokens", {});
        } else {
            //localStorage.removeItem("authTokens");
            removeCookie('authTokens', { path: '/' });
        }
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

    useEffect(() => {
        retrieveTokens();
    }, []);

    const contextData: AuthContextProps = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
