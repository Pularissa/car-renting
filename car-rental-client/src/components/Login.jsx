import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {setShowLogin, axios, setToken, navigate} = useAppContext()

    const [state, setState] = React.useState("login");
    const [userType, setUserType] = React.useState("user"); // "user" or "owner"
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [phone, setPhone] = React.useState("");

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            const payload = state === "register" ? {name, email, password, location, phone} : {email, password}
            const {data} = await axios.post(`/api/user/${state}`, payload)

            if (data.success) {
                setToken(data.token)
                localStorage.setItem('token', data.token)
                setShowLogin(false)
                
                // Navigate based on user type selection (will be corrected by AppContext after user data loads)
                if (userType === "owner") {
                    navigate('/owner')
                } else {
                    navigate('/')
                }
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        
    }

  return (
    <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>

      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">{userType === "owner" ? "Owner" : "User"}</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            
            {/* User Type Selection */}
            <div className="w-full">
                <p>Login as:</p>
                <div className="flex gap-2 mt-1">
                    <button 
                        type="button"
                        onClick={() => setUserType("user")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                            userType === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        Customer
                    </button>
                    <button 
                        type="button"
                        onClick={() => setUserType("owner")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                            userType === "owner" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        Car Owner
                    </button>
                </div>
            </div>
            {state === "register" && userType === "user" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            {state === "register" && userType === "user" && (
                <div className="w-full">
                    <p>Location</p>
                    <input onChange={(e) => setLocation(e.target.value)} value={location} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            {state === "register" && userType === "user" && (
                <div className="w-full">
                    <p>Phone Number</p>
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="tel" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    placeholder={userType === "owner" ? "owner@gmail.com" : "type here"} 
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                    type="email" 
                    required 
                />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    placeholder={userType === "owner" ? "Enter your password" : "type here"} 
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                    type="password" 
                    required 
                />
            </div>
            {state === "register" && userType === "user" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : userType === "user" ? (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p className="text-sm text-gray-500 text-center">
                    Owner account: owner@gmail.com
                </p>
            )}
            <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" && userType === "user" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login
