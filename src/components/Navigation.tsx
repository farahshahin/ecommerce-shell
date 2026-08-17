import { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  AccountCircleOutlined,
  Close,
  FavoriteBorder,
  Menu,
  ShoppingBagOutlined,
} from "@mui/icons-material";

const AUTH_KEY = "ElectroShop:isLoggedIn";

const navItems = [
  ["Home", "/"],
  ["Categories", "/categories"],
  ["Products", "/products"],
  ["Cart", "/cart"],
  ["Account", "/account"],
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem(AUTH_KEY) === "true"
  );

  useEffect(() => {
    const checkAuth = () => {
      setLoggedIn(
        localStorage.getItem(AUTH_KEY) === "true"
      );
    };

    checkAuth();

    window.addEventListener(
      "storage",
      checkAuth
    );

    window.addEventListener(
      "message",
      checkAuth
    );

    const interval = setInterval(
      checkAuth,
      300
    );

    return () => {
      window.removeEventListener(
        "storage",
        checkAuth
      );

      window.removeEventListener(
        "message",
        checkAuth
      );

      clearInterval(interval);
    };
  }, []);

  const go = (path: string) => {
    window.parent.postMessage(
      {
        type: "NAVIGATE",
        path,
      },
      "*"
    );

    setOpen(false);
  };

  if (!loggedIn) {
    return null;
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.96)",
          color: "#15233c",
          borderBottom: "1px solid #e9edf3",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: "56px",
              md: "64px",
            },
            px: {
              xs: 1.5,
              sm: 2.5,
              md: 4,
              lg: 5,
            },
            gap: {
              xs: 0.5,
              md: 1.5,
            },
            "&.MuiToolbar-root": {
              minHeight: {
                xs: "56px",
                md: "64px",
              },
            },
          }}
        >
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
              color: "#526071",
              width: 36,
              height: 36,
              flexShrink: 0,
              "&:hover": {
                bgcolor: "#f3f6fa",
                color: "#2167dc",
              },
            }}
          >
            <Menu fontSize="small" />
          </IconButton>

          <Box
            onClick={() => go("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              cursor: "pointer",
              flexShrink: 0,
              mr: {
                xs: "auto",
                md: 0,
              },
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "#2167dc",
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                boxShadow:
                  "0 5px 14px rgba(32,103,220,0.20)",
              }}
            >
              E
            </Box>

            <Typography
              sx={{
                fontSize: {
                  xs: 18,
                  md: 20,
                },
                fontWeight: 800,
                letterSpacing: "-0.045em",
                color: "#15233c",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              Electro
              <Box
                component="span"
                sx={{
                  color: "#2167dc",
                }}
              >
                Shop
              </Box>
            </Typography>
          </Box>

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              flex: 1,
              whiteSpace: "nowrap",
              mx: 3,
            }}
          >
            {navItems
              .filter(
                ([label]) =>
                  label !== "Cart" &&
                  label !== "Account"
              )
              .map(([label, path]) => (
                <Box
                  key={label}
                  component="button"
                  onClick={() => go(path)}
                  sx={{
                    border: 0,
                    outline: "none",
                    background: "transparent",
                    cursor: "pointer",
                    px: 1.5,
                    py: 0.75,
                    color: "#596579",
                    fontFamily: "inherit",
                    fontSize: 13.5,
                    fontWeight: 600,
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#2167dc",
                      bgcolor: "#f4f7fc",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  {label}
                </Box>
              ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: {
                xs: 0,
                sm: 0.2,
                md: 0.3,
              },
              flexShrink: 0,
              ml: {
                md: "auto",
              },
              whiteSpace: "nowrap",
            }}
          >
            <IconButton
              onClick={() => go("/wishlist")}
              sx={{
                color: "#526071",
                width: 36,
                height: 36,
                flexShrink: 0,
                "&:hover": {
                  bgcolor: "#f3f6fa",
                  color: "#2167dc",
                },
              }}
            >
              <FavoriteBorder
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>

            <IconButton
              onClick={() => go("/cart")}
              sx={{
                color: "#526071",
                width: 36,
                height: 36,
                flexShrink: 0,
                "&:hover": {
                  bgcolor: "#f3f6fa",
                  color: "#2167dc",
                },
              }}
            >
              <ShoppingBagOutlined
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>

            <IconButton
              onClick={() =>
                go("/account/profile")
              }
              sx={{
                color: "#526071",
                width: 36,
                height: 36,
                flexShrink: 0,
                "&:hover": {
                  bgcolor: "#f3f6fa",
                  color: "#2167dc",
                },
              }}
            >
              <AccountCircleOutlined
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "82vw",
                sm: 300,
              },
              maxWidth: 320,
              bgcolor: "#fff",
            },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              borderBottom:
                "1px solid #edf0f5",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.8,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#2167dc",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                E
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 17,
                  color: "#15233c",
                  whiteSpace: "nowrap",
                }}
              >
                Electro
                <Box
                  component="span"
                  sx={{
                    color: "#2167dc",
                  }}
                >
                  Shop
                </Box>
              </Typography>
            </Box>

            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                width: 36,
                height: 36,
                color: "#526071",
                "&:hover": {
                  bgcolor: "#f3f6fa",
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          <List
            sx={{
              px: 1.2,
              py: 1.5,
            }}
          >
            {navItems.map(
              ([label, path]) => (
                <ListItemButton
                  key={label}
                  onClick={() => go(path)}
                  sx={{
                    minHeight: 44,
                    mb: 0.4,
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                    "&:hover": {
                      bgcolor: "#f3f7fd",
                    },
                    "&:hover .MuiListItemText-primary":
                      {
                        color: "#2167dc",
                      },
                  }}
                >
                  <ListItemText
                    primary={label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#526071",
                          whiteSpace:
                            "nowrap",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}