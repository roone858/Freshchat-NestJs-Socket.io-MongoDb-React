import { useEffect, useState } from "react";
import ChatListItem from "../ChatListItem";
import usersService from "../../services/users.service";
import { User } from "../../types/types";
import React from "react";
const ItemMemo = React.memo(ChatListItem);
const ChatList = ({
  setReceiver,
  receiver,
}: {
  setReceiver: (user: User) => void;
  receiver?: User;
}) => {
  const [users, setUsers] = useState<User[]>();
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await usersService.getUsers();
      setUsers(res);
    };
    fetchUsers();
  }, []);
  return (
    <ul>
      {users?.map((user, index) => (
        <div key={index} onClick={() => setReceiver(user)}>
          <ItemMemo receiver={receiver} user={user} />
        </div>
      ))}
    </ul>
  );
};

export default ChatList;
