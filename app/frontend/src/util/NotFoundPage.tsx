import CSS from "csstype";

const NotFoundPage: React.FunctionComponent = () => {
  const defaultStyle: CSS.Properties = {
    position: "absolute",
    top: "30%",
    left: "40%",
  };

  return (
    <div style={defaultStyle}>
      <h1>404</h1>
      <h2>Sorry, but page not found</h2>
    </div>
  );
};

export default NotFoundPage;
