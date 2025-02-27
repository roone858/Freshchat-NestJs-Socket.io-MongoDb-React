interface InputFieldProps {
     icon: string;
     label: string;
     name: string;
     type?: string;
     value: string;
     onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
     placeholder: string;
   }
const InputField = ({
     icon,
     label,
     name,
     type = "text",
     value,
     onChange,
     placeholder,
   }: InputFieldProps) => (
     <div className="mb-5">
       <label className="font-medium text-gray-700 dark:text-gray-100">
         {label} 
       </label>
       <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
         <span
           className="flex items-center px-4 py-2 text-gray-300 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600"
           id="basic-addon3"
         >
           <i className={`${icon} "text-16"`}></i>
         </span>
         <input
           type={type}
           name={name}
           value={value}
           onChange={onChange}
           className="w-full px-2 py-2 border-gray-100 border outline-none bg-transparent rounded rounded-l-none placeholder:text-14 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200"
           placeholder={placeholder}
         />
       </div>
     </div>
   );

export default InputField;
   