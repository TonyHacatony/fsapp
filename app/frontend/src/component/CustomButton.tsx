import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Button from "@mui/material/Button";
import { DefaultComponentProps, OverridableTypeMap } from "@mui/material/OverridableComponent";

const CustomButton = (props: DefaultComponentProps<OverridableTypeMap> & { children: ReactJSXElement | string }) => {
  const updatedProps: DefaultComponentProps<OverridableTypeMap> = { variant: "contained", ...props };
  return <Button {...updatedProps}>{props.children}</Button>;
};

export default CustomButton;
