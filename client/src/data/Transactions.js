import rwanda from "./images/rwanda-beans.png";
import guetemala from "./images/guetemala-beans.png";

const Transactions = [
  {
    id: 1,
    name: "Kennan Qolby",
    email: "kennan@gmail.com",
    phone: "08123456789",
    address: "Sawangan, Depok",
    status: "Success",
    products: [
      {
        id: 10,
        name: "guetemala",
        price: 109900,
        image: guetemala,
        orderQuantity: 5,
      },
      {
        id: 11,
        name: "rwanda",
        price: 300000,
        description: "description here",
        image: rwanda,
        orderQuantity: 2,
      },
    ],
  },
];

export default Transactions;
