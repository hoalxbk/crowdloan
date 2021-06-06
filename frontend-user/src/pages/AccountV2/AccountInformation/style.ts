import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: any) => {
  return {
    accountInfomationComponent: {
      color: theme?.custom?.colors?.white,
      background: theme?.custom?.colors?.tuna,
      borderRadius: 12,
      padding: "36px 32px",
      marginBottom: 12,
    },

    title: {
      color: theme?.custom?.colors?.white,
      fontFamily: "DM Sans",
      fontWeight: "bold",
      fontSize: 20,
      lineHeight: "24px",
      marginBottom: 28,
    },

    mainInfomation: {},

    inputGroup: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      flexWrap: 'wrap',
      marginBottom: 15,

      "&:last-child": {
        marginBottom: 9,
      },
    },

    btnInputGroup: {
      border: `1px solid ${theme?.custom?.colors?.malibu}`,
      color: theme?.custom?.colors?.malibu,
      fontFamily: "DM Sans",
      fontWeight: "bold",
      fontSize: 12,
      lineHeight: "18px",
      minWidth: "120px",
      height: 32,
      boxSizing: "border-box",
      borderRadius: 36,
      background: "none",
      cursor: "pointer",
      marginLeft: 23,
      marginTop: -5,
    },

    nameInputGroup: {
      color: theme?.custom?.colors?.silverChalice,
      fontFamily: "DM Sans",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "24px",
      minWidth: 160,
      marginRight: 12,
      
      [theme?.breakpoints?.down('xs')]: {
        width: '100%',
      },
    },

    valueInputGroup: {
      color: theme?.custom?.colors?.white,
      fontFamily: "Helvetica",
      fontSize: 16,
      lineHeight: "24px",
    },

    redKiteInfo: {
      marginTop: "25px",

      "& .kyc-info": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },

      "& .kyc-info span": {
        font: "normal normal normal 14px/24px Helvetica",
        color: theme?.custom?.colors?.white,
      },

      [theme.breakpoints.down("xs")]: {
        "& .kyc-info": {
          flexDirection: "column",
          alignItems: "flex-start",
        },
      },
    },

    walletInfo: {
      display: "flex",
      flexDirection: "column",
      background: "rgba(255, 255, 255, 0.06)",
      borderRadius: "8px",
      width: "100%",
      marginTop: "15px",
      padding: "26px 22px",

      "& p": {
        fontFamily: "Helvetica",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "24px",
        color: "#999999",
      },
      "& span": {
        fontWeight: "bold",
        color: theme?.custom?.colors?.white,
        fontSize: "28px",
        lineHeight: "32px",
        fontFamily: "DM Sans",
        fontStyle: "normal",
      },
    },
  };
});

export default useStyles;
