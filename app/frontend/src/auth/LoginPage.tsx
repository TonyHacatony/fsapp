import "./LoginPage.css";

import Stack from "@mui/material/Stack";
import { Divider, Link } from "@mui/material";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import LoginForm from "../component/form/LoginForm";
import { api } from "../util/api";

class LoginPageProps {
  setAuth: (token: string) => void;
}

const LoginPage = ({ setAuth }: LoginPageProps) => {
  async function doGoogleAuth(response: CredentialResponse) {
    api
      .post("api/auth/google", {
        tokenId: response.credential,
      })
      .then((response) => {
        if (response !== null && response.data.token !== null) {
          setAuth(response.data.token);
        }
      });
  }

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
          <GoogleLogin
            theme="filled_blue"
            type="icon"
            onSuccess={doGoogleAuth}
            onError={() => {
              console.log("Login Failed");
            }}
          />
          <Link href="/signup">{"Don't have an account? Create it"}</Link>
        </Stack>
      </Stack>
    </div>
  );
};

export default LoginPage;
