"use client";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/animaton3.png";
import FilterIcon from "@mui/icons-material/Filter";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import "./Header.css";
import NavBar from "../Navbar/Navbar";
import SearchBar from "../SearchBar/SearchBar";

const browseItems = [
  { Icon: FilterIcon, label: "Anime", linkTo: "/anime" },
  { Icon: AutoStoriesIcon, label: "Manga", linkTo: "/manga" },
  { Icon: AccountBoxIcon, label: "Staff", linkTo: "/staff" },
  {
    Icon: AccountBoxOutlinedIcon,
    label: "Characters",
    linkTo: "/characters",
  },
];
const Header: React.FC = () => {
  // State để quản lý mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Function để toggle mobile menu
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function để đóng mobile menu
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Search handlers
  const handleHeaderSearch = (query: string) => {
    console.log("Header search:", query);
    // TODO: Implement global search functionality
  };

  const handleHeaderSearchChange = (query: string) => {
    console.log("Header search query changed:", query);
    // TODO: Implement global search suggestions
  };

  return (
    <>
      <AppBar
        position="fixed"
        className="header"
        sx={{
          borderRadius: 0,
          "& .MuiAppBar-root": {
            borderRadius: 0,
          },
        }}
      >
        <Toolbar className="header__toolbar">
          <Link href="/" className="header__logoLink">
            <Image className="header__logo" src={Logo} alt="Logo" />
          </Link>
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 30 }}>
            <NavBar items={browseItems} />
          </Box>
          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              width: 300,
              mr: 2,
            }}
          >
            <SearchBar
              placeholder="Tìm kiếm..."
              onSearch={handleHeaderSearch}
              onChange={handleHeaderSearchChange}
              variant="outlined"
              fullWidth={true}
            />
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileMenuToggle}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            backgroundColor: "#1a1a1a",
            color: "white",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
            borderBottom: "1px solid #333",
          }}
        >
          <Typography variant="h6" component="div">
            Menu
          </Typography>
          <IconButton onClick={handleMobileMenuClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* SearchBar - Mobile */}
        <Box sx={{ padding: 2, borderBottom: "1px solid #333" }}>
          <SearchBar
            placeholder="Tìm kiếm..."
            onSearch={handleHeaderSearch}
            onChange={handleHeaderSearchChange}
            variant="outlined"
            fullWidth={true}
          />
        </Box>

        <List>
          {browseItems.map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              href={item.linkTo}
              onClick={handleMobileMenuClose}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <item.Icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
