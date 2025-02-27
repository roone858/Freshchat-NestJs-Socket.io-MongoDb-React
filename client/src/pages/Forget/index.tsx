import { FormEvent, useState } from "react";
import {
  resetPassword,
  sendResetCode,
  verifyResetCode,
} from "../../services/auth.service";
import logo from "../../assets/logo.svg";
import InputField from "../../components/InputField";
import Alert from "../../components/Alert";
import LoadingSpinner from "../../components/LoadingSpinner";

const Forget = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState({ message: "", isError: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setAlert({ message: "", isError: false });

    try {
      if (step === 1) {
        await sendResetCode(formData.email);
        setStep(2);
      } else if (step === 2) {
        await verifyResetCode(formData.email, formData.otp);
        setStep(3);
      } else if (step === 3) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        await resetPassword(formData.email, formData.otp, formData.password);
        setAlert({ message: "Password reset successfully!", isError: false });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      setAlert({ message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-18 min-h-screen sm:px-24 lg:px-0">
      <div className="container grid grid-cols-12 place-items-center justify-center">
        <div className="col-start-4 mx-auto col-span-6">
          <div className="text-center">
            <img src={logo} alt="Logo" className="h-8 mt-10 mx-auto" />
            <h4 className="m-2 text-gray-800 text-21 dark:text-gray-50">
              {step === 1
                ? "Find your FreshChat account"
                : step === 2
                ? "Enter OTP"
                : "Reset Password"}
            </h4>
            <p className="mb-5 text-gray-500 dark:text-gray-300">
              {step === 1
                ? "Enter your email address to receive a reset code."
                : step === 2
                ? "Check your email for the reset code and enter it below."
                : "Enter your new password and confirm it."}
            </p>
          </div>
          <div className="bg-white card dark:bg-zinc-800 dark:border-transparent p-6 break-words ">
            <form onSubmit={handleSubmit} className="break-words">
              {step === 1 && (
                <InputField
                  icon="ri-mail-line"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="mahmoud@host.com"
                />
              )}
              {step === 2 && (
                <InputField
                  label="Code"
                  name="otp"
                  icon="ri-lock-line"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="######"
                />
              )}
              {step === 3 && (
                <>
                  <InputField
                    label="New Password"
                    type="password"
                    name="password"
                    icon="ri-lock-line"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="New Password"
                  />
                  <InputField
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    icon="ri-lock-line"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                  />
                </>
              )}
              {alert.message && (
                <Alert message={alert.message} isError={alert.isError} />
              )}
              <button
                className="py-2 w-full text-white border-transparent btn bg-violet-500 hover:bg-violet-600 text-16"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : step === 3 ? (
                  "Reset Password"
                ) : (
                  "Next"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forget;
