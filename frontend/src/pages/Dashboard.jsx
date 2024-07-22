import { useEffect, useState } from "react";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";

export const Dashboard = () => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/v1/account/balance",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setValue(res.data.balance);
    };
    fetchData();
  }, []);
  return (
    <div className="px-2">
      <AppBar></AppBar>
      <div className="px-10 pt-7">
        <Balance value={value}></Balance>
        <Users></Users>
      </div>
    </div>
  );
};
