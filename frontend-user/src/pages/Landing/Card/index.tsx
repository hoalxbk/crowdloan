import useStyles from './style';
import commonStyle from '../../../styles/CommonStyle'

export const LandingCard = (props: any) => {
  const styles = useStyles();
  const common = commonStyle();

  const {
    cardInfo
  } = props

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardImage}>
        <img src={cardInfo.image}/>
      </div>
      <div className={styles.mainContent}>
        <h2 className={"card__title " + common.nnb2832d}>{cardInfo.title}</h2>
        <p className={"card__description" + common.nnn1424h}>{cardInfo.description}</p>
      </div>
    </div>
  );
};
