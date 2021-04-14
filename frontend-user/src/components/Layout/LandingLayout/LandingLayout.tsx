import MainDefaultLayout from '../../Base/MainDefaultLayout';
import HeaderLandingLayout from '../../Base/HeaderLandingLayout';
import FooterLandingLayout from '../../Base/FooterLandingLayout';
import { useCommonStyle } from '../../../styles';

const LandingLayout = (props: any) => {
  const commonStyle = useCommonStyle();

  return (
    <div className={commonStyle.DefaultLayout}>
      <HeaderLandingLayout/>
      <MainDefaultLayout backgroundColor="#020618">{props.children}</MainDefaultLayout>
      <FooterLandingLayout/>
    </div>
  );
};

export default LandingLayout;