import { Stack } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import { FormikErrors, FormikHelpers, FormikProps, FormikValues } from "formik";

import { api, parseError } from "../../util/api";
import { AuthProps } from "../../util/CustomPropTypes";
import Button from "../CustomButton";
import {
  FormInputType,
  CustomForm,
  FormInputObj,
  FormProps,
  createInputs,
} from "./CustomForm";

const firstPageInputs: FormInputObj[] = [
  new FormInputObj("email", "Email", FormInputType.email),
];

const secondPageInputs: FormInputObj[] = [
  new FormInputObj("name", "Name"),
  new FormInputObj("password", "Password", FormInputType.password),
  new FormInputObj("password_check", "Password repetition", FormInputType.password),
];

const SignUpForm = ({ setAuth }: AuthProps) => {
  const firstStep: FormProps = {
    title: 'Enter an email',
    formInputs: firstPageInputs,

    validate(values: FormikValues): void | FormikErrors<FormikValues> {
      console.log('validate sign up');
      console.log(values.email);
      const errors: FormikErrors<FormikValues> = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      return errors;
    },
    async submit(values: FormikValues, props: FormikHelpers<FormikValues>): Promise<any> {
      const email = values.email;
      const res: AxiosResponse = await api.get(`api/auth/email/${email}`);
      if (res.data) {
        props.setSubmitting(false);
        return Promise.resolve(true);
      }
      props.setErrors({ email: 'User with this email already exists'})
      props.setSubmitting(false);
      return Promise.resolve(false);
    },
    getForm(props: FormikProps<FormikValues>): JSX.Element {
      return (
        <>
          <Stack spacing={2} direction="column">
            <>{createInputs(props, firstPageInputs)}</>
            <Button
              disabled={props.isSubmitting}
              type="submit"
            >Continue</Button>
          </Stack>
        </>
      );
    }
  };

  const secondStep: FormProps = {
    title: 'Create a new password',
    formInputs: secondPageInputs,

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
      const body = {
        email: values.email,
        name: values.name,
        password: values.password,
      };
      api
        .post(`api/auth/signup`, body)
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
            <>{createInputs(props, secondPageInputs)}</>
            <Button
              disabled={props.isSubmitting}
              type="submit"
            >Create acoount</Button>
          </Stack>
        </>
      );
    },
  };

  return (
    <CustomForm forms={[firstStep, secondStep]} />
  );
};

export default SignUpForm;
