import { User } from "./context/AuthContext";

export function updateUser(user: User) {
  const storage = localStorage.getItem("users");

  if (!storage) {
    return;
  }

  const existingUsers: User[] = JSON.parse(storage);

  existingUsers.some((object, idx) => {
    if (object.username === user.username) {
      existingUsers[idx] = user;
    }
  });

  localStorage.setItem("users", JSON.stringify(existingUsers));
}
