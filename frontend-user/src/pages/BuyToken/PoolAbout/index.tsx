import React from 'react';
import useStyles from './style';

const PoolAbout: React.FC<any> = (props: any) => {
  const styles = useStyles();

  return (
    <div className={styles.PoolAbout}>
      <div className={styles.PoolAboutBlock}>
        <span className={styles.PoolAboutLabel}>Website</span>
        <strong className={styles.PoolAboutText}>
          {'http://polkafoundry.com'}
          <img src="/images/hyperlink.svg" className={styles.PoolAboutIcon}/>
        </strong>
      </div>
      <div className={styles.PoolAboutBlock}>
        <span className={styles.PoolAboutLabel}>White Paper</span>
        <strong className={styles.PoolAboutText}>
          {'polkafoundry.pdf'}
          <img src="/images/download.svg" className={styles.PoolAboutIcon} />
        </strong>
      </div>
      <div className={styles.PoolAboutBlock}>
        <span className={styles.PoolAboutLabel}>Exchange Rate</span>
        <strong className={styles.PoolAboutText}>
          <a href="/twitter.com/polkafoundry">
            twitter.com/polkafoundry
          </a>
        </strong>
      </div>
      <p className={styles.PoolAboutDesc}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt tortor lacus, et dapibus eros vestibulum et. Proin venenatis, felis eget ullamcorper ultricies, metus ligula tempor mi, in bibendum tellus eros ac arcu. Proin sed ante tristique, volutpat nisl vel, cursus odio. Morbi mollis non magna ut consequat. Maecenas efficitur mi vitae pretium tincidunt. Sed non accumsan justo, eu iaculis est. Proin turpis nisl, vulputate ut massa ullamcorper, laoreet finibus ligula. Praesent arcu odio, consequat ac augue vel, egestas semper massa. Nulla facilisi. Vestibulum finibus turpis ut tristique bibendum.</p>
    </div>
  )
}

export default PoolAbout;
