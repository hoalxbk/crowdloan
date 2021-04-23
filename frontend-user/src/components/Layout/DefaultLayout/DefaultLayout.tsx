import React from 'react';
import MainDefaultLayout from '../../Base/MainDefaultLayout';
import HeaderDefaultLayout from '../../Base/HeaderDefaultLayout';
import FooterDefaultLayout from '../../Base/FooterDefaultLayout';
import { useCommonStyle } from '../../../styles';

const DefaultLayout = (props: any) => {
  const commonStyle = useCommonStyle();

  return (
    <div className={commonStyle.DefaultLayout}>
      <HeaderDefaultLayout/>
      <MainDefaultLayout>{props.children}</MainDefaultLayout>
      <FooterDefaultLayout/>
    </div>
  );
};

export default DefaultLayout;
