import React, { FormEvent, useEffect, useState } from "react";
import { login } from "../../services/auth.service";
import { setTokenInAxios } from "../../utils/axios";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });
  const [err, setErr] = useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      navigate("/"); // Redirect to chat if already logged in
    }
  }, [navigate]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await login({
        username: data.username,
        password: data.password,
      });
      sessionStorage.setItem("accessToken", response.access_token);
      setTokenInAxios();
      sessionStorage.setItem("user", JSON.stringify(response.user));
      window.location.href = "/";
      setErr(false);
    } catch (err) {
      setErr(true);
      console.log(err);
    }
  };
  return (
    <div>
      <div className="px-5 py-18 min-h-screen  sm:px-24 lg:px-0">
        <div className="container grid  grid-cols-12 place-items-center justify-center ">
          <div className="col-start-4 mx-auto col-span-6 ">
            <div className="text-center">
              <div className="block mb-3">
                <img
                  src={logo}
                  alt=""
                  className=" h-8 my-auto mt-10 mx-auto block "
                />
              </div>

              <h4 className="mb-2 text-gray-800 text-21 dark:text-gray-50">
                Sign in
              </h4>
              <p className="mb-6 text-gray-500 dark:text-gray-300">
                Sign in to continue to FreshChat.
              </p>
            </div>
            <div className="bg-white card dark:bg-zinc-800 dark:border-transparent">
              <div className="p-5">
                <div className="p-4">
                  <form action="#" onSubmit={handleSubmit}>
                    <InputField
                      name="username"
                      value={data.username}
                      label="  Username"
                      icon="ri-user-2-line"
                      onChange={handleInputChange}
                      placeholder="Enter Username"
                    />

                    <div className="mb-6">
                      <div className="float-right mt-1">
                        <div
                          className="hover:cursor-pointer"
                          onClick={() => navigate("/forget")}
                        >
                          <p className="text-gray-300 text-xs ">
                            Forgot password?
                          </p>
                        </div>
                      </div>
                      <InputField
                        name="password"
                        value={data.password}
                        label="Password"
                        icon="ri-lock-2-line"
                        onChange={handleInputChange}
                        placeholder="Enter Password"
                      />
                    
                    </div>

                    <div className="flex items-center mb-6">
                      <input
                        type="checkbox"
                        className="border-gray-100 rounded focus:ring-1 checked:ring-1 focus:ring-offset-0 focus:outline-0 checked:bg-violet-500 dark:bg-zinc-600 dark:border-zinc-600 dark:checked:bg-violet-500 "
                        id="memberCheck1"
                      />
                      <label
                        className="font-medium px-2 text-gray-700 ltr:ml-2 rtl:mr-2 dark:text-gray-200"
                        htmlFor="remember-check"
                      >
                        Remember me
                      </label>
                    </div>
                    {err && (
                      <div
                        className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                        role="alert"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                          <span className="font-medium">!</span> Username or
                          Password is invalid.
                        </div>
                      </div>
                    )}
                    <div className="grid">
                      <button
                        className="py-2 text-white border-transparent btn bg-violet-500 hover:bg-violet-600 text-16"
                        type="submit"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="mb-5 text-gray-700 dark:text-gray-200">
                Don't have an account ?{" "}
                <a href="auth-register" className="fw-medium text-violet-500">
                  {" "}
                  Signup now{" "}
                </a>{" "}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                ©{new Date().getFullYear()} FreshChat. Crafted with{" "}
                <i className="text-red-500 mdi mdi-heart"></i> by Mahmoud Gamal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <h1 className="text-white">FreshChat</h1>
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action="#"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your username
                  </label>
                  <input
                    type="username"
                    name="username"
                    onChange={handleInputChange}
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="username"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleInputChange}
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <Link to={"forget"}>
                    <div className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Forgot password?
                    </div>
                  </Link>
                </div>
                {err && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">
                      username or password is incorrect !
                    </span>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
