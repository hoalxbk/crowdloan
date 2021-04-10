import React from 'react';
import ButtonLink from "./index";
import {withRouter} from "react-router-dom";

function BackButton(props: any) {
  const { to } = props;
  const goBack = () => {
    const { history } = props;
    history.goBack();
  };
  return (
    <>
      <ButtonLink onClick={goBack} spacing={6} to={to} text="Back" icon="icon-arrow-left.svg" />
    </>
  );
}

export default withRouter(BackButton);
