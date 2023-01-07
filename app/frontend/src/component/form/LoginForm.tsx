import { FormikErrors, FormikHelpers, FormikProps, FormikValues } from "formik";
import { Stack } from "@mui/material";

import { api, parseError } from "../../util/api";
import { AuthProps } from "../../util/CustomPropTypes";
import {
  FormInputType,
  CustomForm,
  FormInputObj,
  FormProps,
  createInputs,
} from "./CustomForm";
import Button from "../CustomButton";
import { AxiosError } from "axios";

const loginInputs: FormInputObj[] = [
  new FormInputObj("email", "Email", FormInputType.email),
  new FormInputObj("password", "Password", FormInputType.password),
];

const LoginForm = ({ setAuth }: AuthProps) => {
  const loginForm: FormProps = {
    title: 'Log in form',
    formInputs: loginInputs,

    validate(values: FormikValues): void | FormikErrors<FormikValues> {
      const errors: FormikErrors<FormikValues> = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      return errors;
    },
    submit(values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>): void | Promise<any> {
      api
        .post(`api/auth/login`, {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          if (response !== null && response.data.token !== null) {
            setAuth(response.data.token);
          }
          setSubmitting(false);
        })
        .catch((err: AxiosError) => {
          setSubmitting(false);
          alert(parseError(err));
        });
    },
    getForm(props: FormikProps<FormikValues>): JSX.Element {
      return (
        <>
          <Stack spacing={2} direction="column">
            <>{createInputs(props, loginInputs)}</>
            <Button
              disabled={props.isSubmitting}
              type="submit"
            >Log In</Button>
          </Stack>
        </>
      );
    },
  };

  return (
    <CustomForm forms={[loginForm]} />
  );
};

export default LoginForm;
