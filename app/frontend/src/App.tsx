import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import jwt from "jwt-decode";
import { TokenPayload } from "@lib/type";

import LoginPage from "./auth/LoginPage";
import WelcomePage from "./main/WelcomePage";
import NotFoundPage from "./util/NotFoundPage";
import SignUpPage from "./auth/SignUpPage";
import { SessionStorage } from "./util/GlobalVariables";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

class AuthGuardProps {
  token:string;
  element: ReactJSXElement;
}

const AuthGuard = ({ token, element }: AuthGuardProps) => {
  return Boolean(token) ? element : <Navigate to="/login" replace />;
};

const App: React.FunctionComponent = () => {
  let isAuth: string | null = sessionStorage.getItem(SessionStorage.authToken);

  let navigate: NavigateFunction;

  const setAuth = (token: string | null): void => {
    isAuth = token;
    sessionStorage.setItem(SessionStorage.authToken, token);
    const parsedToken: TokenPayload = jwt(token);
    sessionStorage.setItem(SessionStorage.userName, parsedToken.name);
    if (token) {
      navigate("/welcome");
    } else {
      navigate("/login");
    }
  };

  const removeToken = (): void => {
    sessionStorage.removeItem(SessionStorage.authToken);
    navigate("/login");
  };

  return (
    <Routes>
      <>
        {(navigate = useNavigate())}
        <Route
          path="/"
          element={
            <AuthGuard
              token={isAuth}
              element={<Navigate to="/welcome" replace />}
            />
          }
        />
        <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
        <Route path="/signup" element={<SignUpPage setAuth={setAuth} />} />
        <Route
          path="/welcome"
          element={
            <AuthGuard
              token={isAuth}
              element={
                <WelcomePage
                  name={sessionStorage.getItem(SessionStorage.userName)}
                  signOut={removeToken}
                />
              }
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </>
    </Routes>
  );
};

export default App;
