import React, { FormEvent, useEffect, useState } from "react";
import { register } from "../../services/auth.service";
import { setTokenInAxios } from "../../utils/axios";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
      const response = await register({
        name: data.firstName + " " + data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
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
                Sign up
              </h4>
              <p className="mb-6 text-gray-500 dark:text-gray-300">
                Get your FreshChat account now.
              </p>
            </div>
            <div className="bg-white card dark:bg-zinc-800 dark:border-transparent">
              <div className="p-5">
                <div className="p-4">
                  <form action="#" onSubmit={handleSubmit}>
                    <div className="flex gap-5 max-w-sm">
                      <InputField
                        name="firstName"
                        value={data.firstName}
                        label="First Name"
                        icon="ri-user-2-line"
                        onChange={handleInputChange}
                        placeholder="First Name"
                      />{" "}
                      <InputField
                        name="lastName"
                        value={data.lastName}
                        label="Last Name"
                        icon="ri-user-2-line"
                        onChange={handleInputChange}
                        placeholder="Last Name"
                      />
                    </div>
                    <InputField
                      name="username"
                      value={data.username}
                      label="Username"
                      icon="ri-user-2-line"
                      onChange={handleInputChange}
                      placeholder="Enter Username"
                    />
                    <InputField
                      name="email"
                      value={data.email}
                      label="Email"
                      icon="ri-mail-line"
                      onChange={handleInputChange}
                      placeholder="Enter Your Email"
                    />

                    <InputField
                    type="password"
                      name="password"
                      value={data.password}
                      label="Password"
                      icon="ri-lock-2-line"
                      onChange={handleInputChange}
                      placeholder="Enter Password"
                    />

                    <InputField
                      name="confirmPassword"
                    type="password"

                      value={data.confirmPassword}
                      label="Confirm Password"
                      icon="ri-lock-2-line"
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                    />

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
                    <div className="grid mt-6">
                      <button
                        className="py-2 text-white border-transparent btn bg-violet-500 hover:bg-violet-600 text-16"
                        type="submit"
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="mb-5 text-gray-700 dark:text-gray-200">
                By registering you agree to the FreshChat
                <p className="fw-medium text-violet-500"> Terms of Use</p>{" "}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                ©{new Date().getFullYear()} FreshChat. Crafted with{" "}
                <i className="text-red-500 mdi mdi-heart"></i> by Mahmoud Gamal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
