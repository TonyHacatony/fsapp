import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { api } from "../util/api";
import { AuthProps } from "../util/CustomPropTypes";

const GoogleLoginButton = ({ setAuth }: AuthProps) => {
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
    <GoogleLogin
      theme="filled_blue"
      type="icon"
      onSuccess={doGoogleAuth}
      onError={() => {
        alert('Google auth failed');
      }}
    />
  );
};

export default GoogleLoginButton;
