import LoginService from "@/service/LoginService";
import { FormEvent, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { leagueOwnerId } from "../constants";
import { useAuth } from "../context/AuthContext";



const Login = () => {
  const navigate = useNavigate();
  const { login , logout} = useAuth();
  const [erroMessage, setErrorMessage] = useState('')
  const [isLoading , setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
      username: "",
      password: "",
    });

  useEffect(()=>{
          logout();
      },[])



  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let params = {
      id : leagueOwnerId,
      username : formData.username,
      password : formData.password
    };
    LoginService()
            .validateLeagueOwnerLogin(params)
            .then((response: any) => {
              console.log("response=== ", response.data)
              if(response.data.success){
                login();
                navigate("/");
              }else{
                setErrorMessage("Invalid Username or Password");
              }
              setIsLoading(false);
            })
            
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your email"
              className="
                w-full
                h-12
                px-4
                border
                border-gray-300
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-white/40
                transition
              "
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <button
                type="button"
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition"
              >
                Forgot Password?
              </button>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="
                w-full
                h-12
                px-4
                border
                border-gray-300
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-white/40
                transition
              "
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
    type="submit"
    disabled={isLoading}
    className="w-full h-12 gradient-hero text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
  >
    {isLoading ? (
      <>
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Signing In...</span>
      </>
    ) : (
      "Sign In"
    )}
  </button>

          {erroMessage && 
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-red-200"></div>
            <span className="mx-4 text-sm text-red-400">{erroMessage}</span>
            <div className="flex-grow border-t border-red-200"></div>
          </div>
          }

          {/* <button
            type="button"
            onClick={() => navigate("/signup")}
            className="
              w-full
              h-12
              border-2
              border-gray-200
              rounded-xl
              font-semibold
              text-gray-700
              hover:border-gray-300
              hover:bg-gray-50
              transition
            "
          >
            Create New Account
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-gray-800 hover:text-gray-600 transition"
            >
              Sign Up
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;