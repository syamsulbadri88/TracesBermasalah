import usersData from './users.json'; 

export const authenticateUser = (username, password) => {
  const user = usersData.users.find(
    (user) => user.username === username && user.password === password
  );
  return user ? true : false;
};
