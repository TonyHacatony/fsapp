import "./LoginPage.css";

import Stack from "@mui/material/Stack";
import { Divider, Link } from "@mui/material";

import SignUpForm from "../component/form/SignUpForm";
import { AuthProps } from "../util/CustomPropTypes";
import GoogleLoginButton from "./GoogleLoginButton";

const SignUpPage = ({ setAuth }: AuthProps) => {
  return (
    <div className="login_form">
      <Stack spacing={2} direction="column">
        <SignUpForm setAuth={setAuth} />
        <Divider>or</Divider>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          alignContent="center"
        >
          <GoogleLoginButton setAuth={setAuth}/>
          <Link href="/login">{"Log in"}</Link>
        </Stack>
      </Stack>
    </div>
  );
};

export default SignUpPage;
