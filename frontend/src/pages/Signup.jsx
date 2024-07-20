import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signup = () => {
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"}></Heading>
          <SubHeading
            label={"Enter your imformation to create an account"}
          ></SubHeading>
          <InputBox label={"First Name"} placeholder="Ankush"></InputBox>
          <InputBox label={"Last Name"} placeholder="Garg"></InputBox>
          <InputBox label={"Email"} placeholder="ankush@gmail.com"></InputBox>
          <InputBox label={"Password"} placeholder={"123456"}></InputBox>
          <div className="pt-4">
            <Button label={"Sign up"}></Button>
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
