export const getStyles = (theme) => ({
  mainContainer: {
    minHeight: "100vh",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #0B1220 0%, #111A2E 100%)"
        : "linear-gradient(135deg, #F6F7FB 0%, #FFFFFF 100%)",
    p: { xs: 2, md: 3 },
  },

  headerCard: {
    mb: 3,
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #1A2332 0%, #111A2E 100%)"
        : "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
    borderRadius: 3,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0,0,0,0.3)"
        : "0 8px 32px rgba(0,0,0,0.1)",
    border: `1px solid ${theme.palette.divider}`,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: "linear-gradient(90deg, #3F51B5, #00BCD4, #3F51B5)",
      backgroundSize: "200% 100%",
      animation: "gradientShift 3s ease infinite",
    },
    "@keyframes gradientShift": {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" },
    },
  },

  headerCardContent: {
    p: { xs: 3, md: 4 },
  },

  avatar: {
    bgcolor: "primary.main",
    width: 56,
    height: 56,
    boxShadow: "0 4px 14px rgba(63, 81, 181, 0.3)",
  },

  title: {
    fontWeight: 800,
    background: "linear-gradient(45deg, #3F51B5, #00BCD4)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    mb: 0.5,
  },

  printButton: {
    borderRadius: 2,
    px: 3,
    py: 1.5,
    borderColor: "primary.main",
    color: "primary.main",
    "&:hover": {
      borderColor: "primary.dark",
      bgcolor: "primary.main",
      color: "white",
    },
  },

  addButton: {
    borderRadius: 2,
    px: 3,
    py: 1.5,
    background: "linear-gradient(45deg, #3F51B5, #00BCD4)",
    boxShadow: "0 4px 14px rgba(63, 81, 181, 0.3)",
    "&:hover": {
      background: "linear-gradient(45deg, #303F9F, #0097A7)",
      boxShadow: "0 6px 20px rgba(63, 81, 181, 0.4)",
    },
  },

  searchCard: {
    mb: 3,
    borderRadius: 3,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 20px rgba(0,0,0,0.2)"
        : "0 4px 20px rgba(0,0,0,0.08)",
    border: `1px solid ${theme.palette.divider}`,
  },

  searchCardContent: {
    p: 3,
  },

  searchTextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: theme.palette.background.paper,
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
        borderWidth: 2,
      },
    },
  },

  errorCard: {
    mb: 3,
    border: "2px solid",
    borderColor: "error.main",
    borderRadius: 2,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(244, 67, 54, 0.1)"
        : "rgba(244, 67, 54, 0.05)",
  },

  errorCardContent: {
    py: 2,
  },

  errorText: {
    fontWeight: 500,
  },

  tableContainer: {
    borderRadius: 3,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0,0,0,0.3)"
        : "0 8px 32px rgba(0,0,0,0.1)",
    border: `1px solid ${theme.palette.divider}`,
    overflow: "hidden",
  },

  tableHead: {
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #1A2332 0%, #111A2E 100%)"
        : "linear-gradient(135deg, #F8FAFC 0%, #E3F2FD 100%)",
    "& .MuiTableCell-head": {
      fontWeight: 700,
      fontSize: "0.875rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: theme.palette.text.primary,
      borderBottom: `2px solid ${theme.palette.divider}`,
    },
  },

  userAvatar: (blocked) => ({
    bgcolor: blocked ? "grey.500" : "primary.main",
    width: 40,
    height: 40,
    fontSize: "1rem",
    fontWeight: 600,
  }),

  userName: {
    fontWeight: 600,
  },

  roleChip: {
    borderRadius: 1,
    fontWeight: 500,
  },

  statusChip: () => ({
    borderRadius: 1,
    fontWeight: 600,
    minWidth: 70,
  }),

  actionButton: (hoverColor) => ({
    "&:hover": {
      backgroundColor: hoverColor || "primary.light",
      color: "white",
      transform: "scale(1.1)",
    },
    transition: "all 0.2s",
  }),

  tableRow: (index) => ({
    backgroundColor:
      index % 2 === 0
        ? "transparent"
        : theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.02)"
        : "rgba(0,0,0,0.02)",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(63, 81, 181, 0.16)"
          : "rgba(63, 81, 181, 0.06)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease-in-out",
    },
    transition: "all 0.2s ease-in-out",
  }),

  emptyStateIcon: {
    fontSize: 64,
    color: "text.disabled",
    opacity: 0.5,
  },

  dialogPaper: {
    borderRadius: 3,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 25px 50px rgba(0,0,0,0.5)"
        : "0 25px 50px rgba(0,0,0,0.25)",
  },

  dialogTitle: {
    bgcolor: "error.main",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: 2,
  },

  dialogContent: {
    mt: 2,
  },

  dialogActions: {
    p: 3,
    pt: 0,
  },

  cancelButton: {
    borderRadius: 2,
    px: 3,
  },

  deleteButton: {
    borderRadius: 2,
    px: 3,
    bgcolor: "error.main",
    "&:hover": {
      bgcolor: "error.dark",
    },
  },
});
