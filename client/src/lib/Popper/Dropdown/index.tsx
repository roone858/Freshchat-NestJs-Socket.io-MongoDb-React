import { useRef, useState, useEffect, ReactNode } from "react";
import { createPopper } from "@popperjs/core";

const Dropdown = ({ button }: { button: ReactNode }) => {
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
        <div
          ref={menuRef}
          className="absolute z-50"
        >
          <ul className="  z-50  text-gray-800 w-40 py-2  mt-4 text-left  bg-white border rounded shadow-lg ltr:-right-4 border-gray-50 dropdown-menu top-8 dark:bg-zinc-600 bg-clip-padding dark:border-gray-600/50 rtl:-left-5">
          
            <li>
              <a
                className="block w-full px-4 py-2 text-sm font-normal text-gray-800 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-800 ltr:text-left rtl:text-right"
                href="#"
              >
                Archive{" "}
                <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ri-archive-line text-16"></i>
              </a>
            </li>
            <li>
              <a
                className="block w-full px-4 py-2 text-sm font-normal text-gray-800 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-800 ltr:text-left rtl:text-right"
                href="#"
              >
                Muted{" "}
                <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ri-volume-mute-line text-16"></i>
              </a>
            </li>
            <li>
              <a
                className="block w-full px-4 py-2 text-sm font-normal text-gray-800 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-800 ltr:text-left rtl:text-right"
                href="#"
              >
                Delete{" "}
                <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ri-delete-bin-line text-16"></i>
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
