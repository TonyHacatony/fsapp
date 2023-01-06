import {
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikProps,
  FormikValues,
} from "formik";

import Input from "../CustomInput";
import Button from "../CustomButton";
import { Stack } from "@mui/material";

type ValidateFunction = (
  values: FormikValues
) => void | FormikErrors<FormikValues>;

type SubmitFunction = (
  values: FormikValues,
  formikHelpers: FormikHelpers<FormikValues>
) => void | Promise<any>;

class FormProps {
  title: string;
  submitBtnName: string;
  formInputs: FormInputObj[];
  validate: ValidateFunction;
  submit: SubmitFunction;
}

class FormInputObj {
  name: string;
  label: string;
  type?: FormInputType = FormInputType.text;
  initialValue?: any = "";
}

enum FormInputType {
  text = "text",
  email = "email",
  password = "password",
}

const CustomForm = ({
  title,
  submitBtnName,
  formInputs,
  validate,
  submit,
}: FormProps) => {
  return (
    <div className="form">
      <h1>{title}</h1>
      <Formik
        initialValues={collectInitialValues(formInputs)}
        validate={validate}
        onSubmit={submit}
      >
        {(props: FormikProps<FormikValues>) => (
          <form onSubmit={props.handleSubmit}>
            <>
              <Stack spacing={2} direction="column">
                <>{createInputs(props, formInputs)}</>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={props.isSubmitting}
                >
                  {submitBtnName}
                </Button>
              </Stack>
            </>
          </form>
        )}
      </Formik>
    </div>
  );
};

const createInputs = (
  {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
  }: FormikProps<FormikValues>,
  inputs: FormInputObj[]
): object[] | void => {
  console.log(inputs);
  return inputs.map(({ name, label, type }: FormInputObj) => (
    // eslint-disable-next-line react/jsx-key
    <Input
      error={Boolean(errors[name] && touched[name])}
      label={label}
      type={type}
      name={name}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values[name]}
    ></Input>
  ));
};

const collectInitialValues = (inputs: FormInputObj[]): FormikValues =>
  inputs.reduce((acc, { name, initialValue }) => {
    return { ...acc, [name]: initialValue };
  }, {});

export { CustomForm, FormInputType, FormInputObj };
export type { ValidateFunction, SubmitFunction };
