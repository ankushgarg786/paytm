import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
  return (
    <div className="px-2">
      <AppBar></AppBar>
      <Balance value={"50,000"}></Balance>
      <Users></Users>
    </div>
  );
};
