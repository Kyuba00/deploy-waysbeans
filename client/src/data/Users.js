import adminPicture from "./images/default-profile.png";
import userPicture from "./images/user_profile.png";

const Users = [
  {
    id: 1,
    name: "admin",
    email: "admin@gmail.com",
    password: "123",
    image: adminPicture,
    phone: "08123456789",
    address: "Bintaro, Tangerang Selatan",
    role: "admin",
  },
  {
    id: 2,
    name: "Kennan Qolby",
    email: "kennan@gmail.com",
    password: "123",
    image: userPicture,
    phone: "08123456789",
    address: "Sawangan, Depok",
    role: "user",
  },
];

export default Users;
