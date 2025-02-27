import { User } from "../../types/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const ChatListItem = ({
  user,
  lastMessage,
}: {
  lastMessage: string | undefined;
  user: User;
}) => {
  return (
    <li>
      <div className="px-5 py-[15px]  bg-[#303841]  group-data:hover:bg-slate-100 group-data-[theme-color=green]:hover:bg-green-50/50 group-data-[theme-color=red]:hover:bg-red-50/50 transition-all ease-in-out border-b border-white/20 dark:border-zinc-700 group-data-[theme-color=violet]:dark:hover:bg-zinc-600 group-data-[theme-color=green]:dark:hover:bg-zinc-600 group-data-[theme-color=red]:dark:hover:bg-zinc-600 dark:hover:border-zinc-700">
        <a href="#">
          <div className="flex">
            <div className="relative self-center mr-3 ">
              <img
                src={"../src/assets" + user.image}
                className="rounded-full w-9 h-9"
                alt=""
              />
              {user.socketId && (
                <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full top-7 ltr:right-1 rtl:left-1 dark:border-zinc-600"></span>
              )}{" "}
            </div>

            <div className="flex-grow overflow-hidden">
              <h5 className="mb-1 text-base truncate dark:text-gray-50">
                {user.name}
              </h5>
              <p className="mb-0 text-gray-500 truncate dark:text-gray-400 text-14">
                {lastMessage ? lastMessage : "no message yet"}
              </p>
            </div>
            {user.socketId ? (
              <div className="text-green-500 text-11 dark:text-green-400">
                online
              </div>
            ) : (
              <div className="text-gray-500 text-11 dark:text-gray-400">
                {user.lastSeen
                  ? dayjs(user.lastSeen).fromNow()
                  : "offline"}
              </div>
            )}
          </div>
        </a>
      </div>
    </li>
  );
};

export default ChatListItem;
