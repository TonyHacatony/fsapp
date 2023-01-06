import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { api } from "../util/api";

interface WelcomePageProps {
  name: string;
  signOut: () => void;
}

const WelcomePage = ({ name, signOut }: WelcomePageProps) => {
  const [secretResponse, setSecretResponse] = useState("Loading or not...");

  useEffect(() => {
    api
      .get("api/auth/hide")
      .then((res: AxiosResponse) => setSecretResponse(res.data["msg"]))
      .catch((err: AxiosError) => {
        const responseError = err.response.data;
        setSecretResponse(
          `Status code: ${responseError["statusCode"]}, Message: ${responseError["message"]}`
        );
      });
  }, []);

  return (
    <div>
      <h1>Hello, {name}</h1>
      <>{console.log(Object.keys(name))}</>
      <button onClick={() => signOut()}>Sign Out</button>
      <label>{secretResponse}</label>
    </div>
  );
};

export default WelcomePage;
