import { useEffect, useState } from "react";
import ChatListItem from "../ChatListItem";
import usersService from "../../services/users.service";
import { User } from "../../types/types";
import React from "react";
const ItemMemo = React.memo(ChatListItem);
const ChatList = ({
  me,
  setReceiver,
}: {
  me: User;
  setReceiver: (user: User) => void;
}) => {
  const [users, setUsers] = useState<User[]>();
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await usersService.getUsers();
      setUsers(res);
    };
    fetchUsers();
  }, [users]);
  return (
    <ul>
      {users?.map(
        (user, index) =>
          me.username != user.username && (
            <div key={index} onClick={() => setReceiver(user)}>
              <ItemMemo user={user} />
            </div>
          )
      )}
    </ul>
  );
};

export default ChatList;
