import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {ResponseCode} from "../_types/interceptor_types";
import {CheckType} from "../_types/auth_type";

interface authContextInterface  {
    user: any;
    login: (input: any) => Promise<void>;
    register: (input: any) => Promise<void>;
    error?: string;
    validation?: any;
};


export const AuthContext = createContext<authContextInterface | null>(null)

export const useAuth = () => {
    return useContext(AuthContext)
}

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({children} : Props) => {
    const router = useRouter()
    const [validation, setValidation] = useState({});
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

   const login = async (input : any) => {
           const response = await axios.post(`api/auth/login`, input)
           if(response.data.code === ResponseCode.SUCCESS){
               axios.defaults.headers.common["Authorization"] = response.data.token
               setUser(response.data)
               await router.push("/home")
           }
           else if (response.data.code === ResponseCode.OTP_CODE) {
               await router.push({
                   pathname: "/auth/check-otp",
                   query: { email: input.email, checkType: CheckType.Verify },
               });
           }
           else if (response.data.code === ResponseCode.VALIDATION_ERROR){
               setValidation(response.data.data)
           }
           else {
               setValidation({});
           }
   }

   const register = async (input : any) => {

           const response = await axios.post(`api/register`, input)
           if(response.data.code === ResponseCode.SUCCESS){
               await router.push({pathname : "/auth/check-code", query : { email: input.email, checkType: CheckType.Verify}})
           }
           if (response.data.code === ResponseCode.VALIDATION_ERROR) {
               setValidation(response.data.data)
           }
   }

    return (
        <AuthContext.Provider value={useMemo(() => ({
            login,register,user,validation,error
        }), [user, error, validation])}>
            {children}
        </AuthContext.Provider>
    )
}

