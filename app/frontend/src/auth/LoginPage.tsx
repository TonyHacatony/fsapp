import "./LoginPage.css";

import Stack from "@mui/material/Stack";
import { Divider, Link } from "@mui/material";

import LoginForm from "../component/form/LoginForm";
import GoogleLoginButton from "./GoogleLoginButton";

class LoginPageProps {
  setAuth: (token: string) => void;
}

const LoginPage = ({ setAuth }: LoginPageProps) => {
  return (
    <div className="login_form">
      <Stack spacing={2} direction="column">
        <LoginForm setAuth={setAuth} />
        <Divider>or</Divider>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          alignContent="center"
        >
          <GoogleLoginButton setAuth={setAuth} />
          <Link href="/signup">{"Don't have an account? Create it"}</Link>
        </Stack>
      </Stack>
    </div>
  );
};

export default LoginPage;
