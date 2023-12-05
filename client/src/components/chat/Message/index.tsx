import { ClockIcon } from "../../../icons";
import { MessageType, User } from "../../../types/types";

const Message = ({
  showAvatar,
  user,
  message,
  me,
}: {
  me?: boolean;
  showAvatar: boolean;
  user: User;
  message: MessageType;
}) => {
  return (
    <div dir={me ? "rtl" : "ltr"} className="clear-both ">
      <div className=" relative inline-flex  text start  ltr:text-left rtl:text-right ">
        <div className="ltr:mr-4 rtl:ml-4">
          {showAvatar ? (
            <img
              src={"../../src/assets" + user.image}
              alt=""
              className="rounded-full h-9 w-9"
            />
          ) : (
            <div className="rounded-full h-9 w-9"></div>
          )}
        </div>

        <div>
          {showAvatar && (
            <div className="font-medium text-[14px] ltr:text-left rtl:text-right my-2  text-[#a7a9b6] dark:text-gray-300">
              {user.name}
            </div>
          )}
          <div className="flex gap-2 mb-1">
            <div className="  relative px-5 py-3 text-white rounded-lg  rtl:bg-gray-500 ltr:bg-violet-500">
              <p className="mb-0 text-left">{message.message}</p>
              <p
                dir="ltr"
                className="mt-1 mb-0 text-[12px] text-right text-white/50"
              >
                <span
                  className={` align-middle ${
                    me ? "float-left" : "float-right"
                  }  flex justify-center items-center`}
                >
                  <ClockIcon />
                  {new Date(message.timeSent).toLocaleTimeString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
