const Alert = ({ message, isError }: { message: string; isError: boolean }) => (
  <div
    className={`flex items-center p-3 mb-4 text-sm break-words w-full ${
      isError
        ? "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400"
        : "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400"
    }`}
    role="alert"
  >
    <span className="break-words">
      {isError ? (
        <i className="ri-error-warning-fill mr-1"></i>
      ) : (
        <i className="ri-checkbox-circle-fill mr-1"></i>
      )}
    </span>{" "}
    {message}
  </div>
);

export default Alert;
