import { useRef, useState, useEffect, ReactNode } from "react";
import { createPopper } from "@popperjs/core";
interface DropdownItem {
  label: string;
  icon: string;
}

const Dropdown = ({
  button,
  items,
}: {
  button: ReactNode;
  items: DropdownItem[];
}) => {
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (buttonRef.current && menuRef.current) {
      createPopper(buttonRef.current, menuRef.current, {
        placement: "bottom-start",
      });
    }
  }, [open]);

  return (
    <div className="relative dropdown">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="p-0 text-xl text-gray-500 border-0 btn dropdown-toggle dark:text-gray-300"
      >
        {button}
      </button>
      {open && (
        <div ref={menuRef} className="absolute z-50">
          <ul className="   z-50  text-gray-800 w-40 py-2  mt-4 text-left  bg-white  rounded shadow-2xl ltr:-right-4 dropdown-menu top-8 dark:bg-zinc-600 bg-clip-padding  rtl:-left-5">
            {items.map((item, index) => (
              <li key={index}>
                <div
                  onClick={() => {
                    item.label === "Log out" && sessionStorage.clear();
                    window.location.href = "/";
                  }}
                  className=" hover:cursor-pointer flex flex-row justify-between w-full px-4 py-2 text-sm font-normal text-gray-800 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-800 ltr:text-left rtl:text-right"
                >
                  {item.label}{" "}
                  <i
                    className={`text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ${item.icon} text-16`}
                  ></i>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
