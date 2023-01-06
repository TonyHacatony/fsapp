import "./LoginPage.css";

import Stack from "@mui/material/Stack";
import { Divider } from "@mui/material";

import Button from "../component/CustomButton";
import SignUpForm from "../component/form/SignUpForm";
import { AuthProps } from "../util/CustomPropTypes";

const SignUpPage = ({ setAuth }: AuthProps) => {
  return (
    <div className="login_form">
      <Stack spacing={2} direction="column">
        <SignUpForm setAuth={setAuth} />
        <Divider>or</Divider>
        <Button>Sign up with google</Button>
      </Stack>
    </div>
  );
};

export default SignUpPage;
