import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: any) => {
  return {
    tierInfomation: {
      marginTop: 16,
    },

    conversionRate: {
      fontFamily: "Helvetica",
      fontSize: 16,
      lineHeight: "24px",
      color: theme?.custom?.colors?.white,
      display: "flex",

      "& .group": {
        fontFamily: "DM Sans",
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 15,

        '& img': {
          marginLeft: 12, 
          marginRight: 12,
        }
      },
    },

    value: {
      color: theme?.custom?.colors?.malibu,
    }
  };
});

export default useStyles;
