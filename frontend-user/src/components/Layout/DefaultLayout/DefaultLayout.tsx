import React from 'react';
import RightDefaultLayout from '../../Base/RightDefaultLayout';
import LeftDefaultLayout from '../../Base/LeftDefaultLayout';
import { useCommonStyle } from '../../../styles';

const DefaultLayout = (props: any) => {
  const commonStyle = useCommonStyle();

  return (
    <div className={commonStyle.DefaultLayout}>
      <LeftDefaultLayout />
      <RightDefaultLayout>{props.children}</RightDefaultLayout>
    </div>
  );
};

export default DefaultLayout;