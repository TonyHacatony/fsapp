import {
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikProps,
  FormikValues,
} from "formik";
import { useEffect, useState } from "react";

import Input from "../CustomInput";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

type ValidateFunction = (
  values: FormikValues
) => void | FormikErrors<FormikValues>;

type SubmitFunction = (
  values: FormikValues,
  formikHelpers: FormikHelpers<FormikValues>
) => void | Promise<boolean>;

interface FormProps {
  title: string;
  formInputs: FormInputObj[];
  validate: ValidateFunction;
  submit: SubmitFunction;
  getForm: (props: FormikProps<FormikValues>) => ReactJSXElement;
}

class FormInputObj {
  constructor(
    name: string,
    label: string,
    type: FormInputType = FormInputType.text,
    initialValue: any = "",
  ) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.initialValue = this.initialValue;
  }
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

class MFormProps {
  forms: FormProps[];
}

const CustomForm = ({
  forms
}: MFormProps) => {
  const [step, setStep] = useState(0);
  const [activeForm, setActiveForm] = useState(forms[0]);

  const isLastStep = step === (forms.length - 1);

  const handleSubmit = async (values: FormikValues, props: FormikHelpers<FormikValues>) => {
    const submit = await activeForm.submit(values, props);

    console.log('submit');
    console.log(props);
    if (!isLastStep && submit) {
      setStep((prevStep: number) => {
        const nextStep = prevStep + 1;
        setActiveForm(forms[nextStep]);
        return nextStep;
      });

      props.setTouched({});
      props.setSubmitting(false);
    }
  }

  return (
    <div className="form">
      <h1>{activeForm.title}</h1>
      <Formik
        initialValues={collectInitialValues(forms)}
        validate={activeForm.validate}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<FormikValues>) => (
          <form onSubmit={props.handleSubmit}>
            {activeForm.getForm(props)}
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
      helperText={Boolean(touched[name] && errors[name])}
    ></Input>
  ));
};

const collectInitialValues = (forms: FormProps[]): FormikValues =>
  forms
    .reduce((acc, form) => [...acc, ...form.formInputs], [])
    .reduce((acc, { name, initialValue }) => {
      return { ...acc, [name]: initialValue };
    }, {});


export { CustomForm, FormInputType, FormInputObj, createInputs };
export type { ValidateFunction, SubmitFunction, FormProps };
