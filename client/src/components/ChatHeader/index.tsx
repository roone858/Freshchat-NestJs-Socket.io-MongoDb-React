import Dropdown from "../../lib/Popper/Dropdown";
import { User } from "../../types/types";

const ChatHeader = ({ friend }: { friend: User }) => {
  return (
    <div>
      {" "}
      <div className="chat-header grid items-center grid-cols-12 p-8 px-6 border-b dark:border-zinc-600 ">
        <div className="col-span-4 sm:col-span-6">
          <div className="flex items-center gap-3">
            <img
              src={`../../src/assets/${friend.image}`}
              className="rounded-full h-9 w-9"
              alt={friend.name}
            />
            <h5 className="text-gray-800 dark:text-gray-50">{friend.name}</h5>
          </div>
        </div>
        <div className="col-span-4 sm:col-span-6">
          <ul className="flex items-center justify-end lg:gap-4">
            <li className="px-3">
              <div className="relative dropstart">
                <button
                  className="p-0  text-xl text-gray-500 border-0 btn dropdown-toggle dark:text-gray-400"
                  type="button"
                  data-bs-toggle="dropdown"
                  id="dropdownMenuButton10"
                  data-tw-auto-close="outside"
                >
                  <i className="ri-search-line"></i>
                </button>
                <ul
                  className="absolute z-40 hidden mt-2 text-left list-none bg-white border rounded-lg shadow-lg w-fit border-gray-50 dropdown-menu top-8 dark:bg-zinc-700 bg-clip-padding dark:border-gray-700"
                  aria-labelledby="dropdownMenuButton10"
                >
                  <li className="p-2">
                    <input
                      type="text"
                      className="text-gray-500 border-0 rounded bg-gray-50 placeholder:text-14 text-14 dark:bg-zinc-600 dark:text-gray-400 placeholder:dark:text-gray-400 focus:ring-0"
                      placeholder="Search.."
                    />
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <button
                type="button"
                className="hidden text-xl px-3 text-gray-500 border-0 btn dark:text-gray-400 lg:block"
                data-tw-toggle="modal"
                data-tw-target="#audiCallModal"
              >
                <i className="ri-phone-line"></i>
              </button>
            </li>

            {/* <!-- Modal start --> */}
            <li className="relative z-40 hidden modal" id="audiCallModal">
              <div className="fixed inset-0 z-40 overflow-hidden">
                <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                <div className="flex items-center justify-center max-w-lg min-h-screen p-4 mx-auto text-center animate-translate">
                  <div className="relative w-full max-w-lg my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl -top-10 dark:bg-zinc-700">
                    <div className="group-data-[theme-color=violet]:bg-violet-800/10 group-data-[theme-color=green]:bg-green-50/50 group-data-[theme-color=red]:bg-red-50/50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600">
                      <div className="p-4">
                        <div className="p-6">
                          <div className="p-4 text-center">
                            <div className="mb-6">
                              {/* <img src="./assets/images/avatar-4.jpg" alt="" className="w-24 h-24 mx-auto rounded-full"> */}
                            </div>

                            <h5 className="mb-1 text-gray-800 truncate dark:text-gray-50">
                              Doris Brown
                            </h5>
                            <p className="text-gray-500 dark:text-gray-400">
                              Start Audio Call
                            </p>

                            <div className="mt-10">
                              <ul className="flex justify-center mb-1">
                                <li className="px-2 ml-0 mr-2">
                                  <button
                                    type="button"
                                    className="w-12 h-12 text-white bg-red-500 border-transparent rounded-full btn hover:bg-red-600"
                                    data-tw-dismiss="modal"
                                  >
                                    <span className="text-xl bg-transparent">
                                      <i className="ri-close-fill"></i>
                                    </span>
                                  </button>
                                </li>
                                <li className="px-2">
                                  <button
                                    type="button"
                                    className="w-12 h-12 text-white bg-green-500 border-transparent rounded-full btn hover:bg-green-600"
                                  >
                                    <span className="text-xl bg-transparent">
                                      <i className="ri-phone-fill"></i>
                                    </span>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/* <!-- Modal end --> */}

            <li>
              <button
                type="button"
                className="hidden text-xl px-3 text-gray-500 border-0 btn dark:text-gray-400 lg:block"
                data-tw-toggle="modal"
                data-tw-target="#videoCallModal"
              >
                <i className="ri-vidicon-line"></i>
              </button>
            </li>

            {/* <!-- Modal start --> */}
            <li
              className="relative px-3 z-40 hidden modal dark:text-gray-400"
              id="videoCallModal"
            >
              <div className="fixed inset-0 z-40 overflow-hidden">
                <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                <div className="flex items-center justify-center max-w-lg min-h-screen p-4 mx-auto text-center animate-translate">
                  <div className="relative w-full max-w-lg my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl -top-10 dark:bg-zinc-700">
                    <div className="group-data-[theme-color=violet]:bg-violet-800/10 group-data-[theme-color=green]:bg-green-50/50 group-data-[theme-color=red]:bg-red-50/50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600">
                      <div className="p-4">
                        <div className="p-6">
                          <div className="p-4 text-center">
                            <div className="mb-6">
                              <img
                                src="./assets/images/avatar-4.jpg"
                                alt=""
                                className="w-24 h-24 mx-auto rounded-full"
                              />
                            </div>

                            <h5 className="mb-1 truncate dark:text-gray-50">
                              Doris Brown
                            </h5>
                            <p className="text-gray-500 dark:text-gray-400">
                              Start Video Call
                            </p>

                            <div className="mt-10">
                              <ul className="flex justify-center mb-1">
                                <li className="px-2 ml-0 mr-2">
                                  <button
                                    type="button"
                                    className="w-12 h-12 text-white bg-red-500 border-transparent rounded-full btn hover:bg-red-600"
                                    data-tw-dismiss="modal"
                                  >
                                    <span className="text-xl bg-transparent">
                                      <i className="ri-close-fill"></i>
                                    </span>
                                  </button>
                                </li>
                                <li className="px-2">
                                  <button
                                    type="button"
                                    className="w-12 h-12 text-white bg-green-500 border-transparent rounded-full btn hover:bg-green-600"
                                  >
                                    <span className="text-xl bg-transparent">
                                      <i className="ri-vidicon-fill"></i>
                                    </span>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/* <!-- Modal end --> */}

            <li className="px-3">
              <a
                href="#"
                className="hidden text-gray-500 dark:text-gray-400 lg:block profileTab"
              >
                <i className="text-xl ri-group-line"></i>
              </a>
            </li>

            <li className="px-3">
              <Dropdown
                items={[
                  {
                    label: "Archive",
                    icon: "ri-archive-line",
                  },
                  {
                    label: " Muted",
                    icon: " ri-volume-mute-line",
                  },
                  {
                    label: "Delete",
                    icon: "ri-delete-bin-line",
                  },
                ]}
                button={<i className="ri-more-fill"></i>}
              />
              <div className="relative dropdown"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
