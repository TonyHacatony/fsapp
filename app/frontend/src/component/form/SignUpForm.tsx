import { FormikErrors, FormikHelpers, FormikValues } from "formik";

import { api } from "../../util/api";
import { AuthProps } from "../../util/CustomPropTypes";
import {
  FormInputType,
  CustomForm,
  FormInputObj,
  ValidateFunction,
} from "./CustomForm";

const loginInputs: FormInputObj[] = [
  {
    name: "name",
    label: "Name",
    type: FormInputType.text,
  },
  {
    name: "email",
    label: "Email",
    type: FormInputType.email,
  },
  {
    name: "password",
    label: "Password",
    type: FormInputType.password,
  },
];

const validate: ValidateFunction = (values: FormikValues) => {
  const errors: FormikErrors<FormikValues> = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  return errors;
};

const submit = (
  values: FormikValues,
  { setSubmitting }: FormikHelpers<FormikValues>,
  setAuth
) => {
  api
    .post(`api/auth/signup`, {
      name: values.name,
      email: values.email,
      password: values.password,
    })
    .then((response) => {
      if (response !== null && response.data.token !== null) {
        setAuth(response.data.token);
      }
      setSubmitting(false);
    });
};

const SignUpForm = ({ setAuth }: AuthProps) => {
  return (
    <CustomForm
      title="Create new account"
      submitBtnName="Sign Up"
      formInputs={loginInputs}
      validate={validate}
      submit={(
        values: FormikValues,
        formikHelpers: FormikHelpers<FormikValues>
      ) => submit(values, formikHelpers, setAuth)}
    />
  );
};

export default SignUpForm;
