import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Button from "@mui/material/Button";
import { DefaultComponentProps, OverridableTypeMap } from "@mui/material/OverridableComponent";

const CustomButton = (props: DefaultComponentProps<OverridableTypeMap> & { children: ReactJSXElement | string}) => {
  return <Button {...props}>{props.children}</Button>;
};

export default CustomButton;
