import React from 'react';
import useStyles from './styles';
import NetworkWarningBanner from "./NetworkWarningBanner";

const Content: React.FC<any> = (props: any) => {
  const styles = useStyles();
  return (
    <div className={styles.rightLayout}>
      <NetworkWarningBanner/>
      {props.children}
    </div>
  );
};

export default Content;
