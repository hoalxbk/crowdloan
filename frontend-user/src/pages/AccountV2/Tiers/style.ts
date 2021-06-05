import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: any) => {
  return {
    tierComponent: {
      marginBottom: 28,
    },

    titleComponent: {
      color: theme?.custom?.colors?.white,
      fontFamily: "DM Sans",
      fontWeight: "bold",
      fontSize: 20,
      lineHeight: "24px",
      marginBottom: 28,
    },

    desTitleComponent1: {
      color: theme?.custom?.colors?.white,
      fontFamily: "DM Sans",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "24px",
      marginBottom: 2,
    },

    desTitleComponent2: {
      color: theme?.custom?.colors?.silverChalice,
      fontFamily: "Helvetica",
      fontSize: 14,
      lineHeight: "20px",
    },

    iconCheck: {
      position: "absolute",
      right: -2,
      left: "auto !important",
      top: "50%",
      marginTop: 3,
    },

    bgIconCheck: {},

    tierName: {
      color: theme?.custom?.colors?.silverChalice,
      fontFamily: "Helvetica",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "24px",

      "&.active": {
        color: theme?.custom?.colors?.white,
        fontFamily: "DM Sans",
      },
    },

    tierValue: {
      color: theme?.custom?.colors?.silverChalice,
      fontFamily: "Helvetica",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "24px",
    },

    tierNote: {
      display: "flex",
      flexDirection: "column",
      marginTop: 32,

      "& .notice": {
        backgroundColor: "rgba(50, 50, 220, 0.2)",
        padding: "10px",
        marginTop: "24px",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
      },

      "& .notice img": {
        marginTop: "5px",
        width: "25px",
      },

      "& .notice span:first-child": {
        color: "#fff",
        font: "normal normal bold 14px/18px DM Sans",
      },

      "& .notice span:last-child": {
        color: "#999999",
        font: "normal normal normal 12px/18px Helvetica",
      },

      "& .notice-content": {
        marginLeft: "10px",
        display: "flex",
        flexDirection: "column",
      },
    },

    title: {
      color: theme?.custom?.colors?.white,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      width: "100%",
      maxWidth: "100%",
      fontFamily: "DM Sans",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "24px",
    },

    tierLinkToAccount: {
      color: "#6399FF",
      textDecoration: "underline",
    },

    subtitle: {
      fontFamily: "DM Sans",
      fontWeight: "bold",
      fontSize: 28,
      lineHeight: "32px",
      color: theme?.custom?.colors?.malibu,
    },

    tierList: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      marginTop: 25,

      "&::before": {
        content: '""',
        display: "block",
        width: "100%",
        height: 6,
        position: "absolute",
        top: 21.5,
        left: "0",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },

      "& li.process": {
        display: "block",
        height: 6,
        position: "absolute",
        top: 21.5,
        left: "0",
        backgroundColor: "#232394",
        zIndex: 1,
        transition: "1s",
        transitionDelay: "0.5s",
        transitionTimingFunction: "linear",

        "&.inactive": {
          width: "0!important",
        },
      },
    },

    tierInfo: {
      width: "25%",
      position: "relative",

      "&:last-child": {
        width: "0",
      },

      "& > div": {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        zIndex: 2,
        width: "1px",
        whiteSpace: "nowrap",
      },

      "& .icon": {
        marginBottom: 12,
        width: 44,
        height: 48,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        top: 0,

        "& img:last-child": {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          height: 24,
        },
      },

      "& .progress-bar": {
        display: "block",
        height: 6,
        position: "absolute",
        top: 21.5,
        width: "calc(100%)",

        "&.inactive": {
          width: "0",
        },
      },

      "&.first-tier": {
        "& .icon img:first-child": {
          left: "2px",
        },

        "& > div:before": {
          display: "none",
        },
      },

      "&.hide-statistics": {
        "& > div:before": {
          top: -8,
        },

        "& .progress-bar": {
          top: -8,
        },
      },

      "& .info": {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },

      "&:last-child > div": {
        alignItems: "flex-end",

        "& .icon img:first-child": {
          left: "calc(100% - 2px)",
        },

        "& .info": {
          alignItems: "flex-end",
        },

        "&:before": {
          display: "none",
        },
      },

      "&:first-child > div": {
        alignItems: "flex-start",
      },

      "&:first-child > div .info": {
        alignItems: "flex-start",
      },

      "& .tier-name.active": {
        opacity: 1,
      },

      "& .tier-name": {
        font: "normal normal bold 14px/18px DM Sans",
        opacity: "1",
        minHeight: "18px",
      },
    },
    [theme.breakpoints.down("xs")]: {
      customWidth: {
        "&:before": {
          bottom: "20px",
        },
      },

      tierInfo: {
        display: "flex",
        flexDirection: "row",
        width: "auto",
        height: "25%",

        "&.hide-statistics > div:before": {
          top: 0,
        },

        "&:last-child": {
          height: "0!important",
        },

        "& .info": {
          alignItems: "flex-start",
          marginLeft: "10px",
        },

        "& .icon, & .info": {
          marginBottom: "0",
          marginTop: "-20px",
        },

        "&:first-child .icon, &:first-child .info": {
          marginBottom: "0",
          marginTop: "0px",
        },

        "&:last-child .icon, &:last-child .info": {
          marginBottom: "0",
          marginTop: "0px",
        },

        "& .icon img:first-child": {
          top: "50%!important",
          left: "50%!important",
        },

        "& .icon img:last-child": {
          top: "calc(50% - 2px)!important",
          left: "50%!important",
        },

        "& span:last-child": {
          height: "18px",
        },

        "&:nth-child(2) span:last-child": {
          width: "100%",
          display: "block",
        },

        "&:last-child span:last-child": {
          textAlign: "right",
        },

        "&:last-child .info": {
          alignItems: "flex-start!important",
        },

        "& > div": {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
          width: "auto",
          marginLeft: "33px",
        },

        "& > div:before": {
          top: "-1px",
          height: "1px",
          marginLeft: "-21px",
          width: 6,
        },

        "& .progress-bar": {
          display: "block",
          width: 6,
          position: "absolute",
          top: "0",
          left: "11.5px",
          height: "calc(100%)",

          borderBottomLeftRadius: "0",
          borderTopLeftRadius: "0",

          "&.inactive": {
            width: "0",
          },
        },
      },

      tierList: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        position: "relative",
        height: "500px",

        "&::before": {
          content: '""',
          display: "block",
          width: 6,
          height: "100%",
          position: "absolute",
          top: "0",
          left: "11.5px",
          backgroundColor: "#44454B",
        },

        "& li.process": {
          height: "0",
          width: 6,
          position: "absolute",
          top: "0",
          left: "11.5px",

          "&.inactive": {
            width: "5!important",
            height: "0!important",
          },
        },
      },
    },
  };
});

export default useStyles;
