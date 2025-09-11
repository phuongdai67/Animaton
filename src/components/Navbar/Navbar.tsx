import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import "./Navbar.css";

type NavItem = {
  Icon: React.ElementType;
  label: string;
  linkTo: string;
};

type Props = {
  items: NavItem[];
};

const NavBar = ({ items }: Props) => {
  // if (isMobile) {
  //   return (
  //     <>
  //       {items.map((item) => (
  //         <MenuItem key={item.label}>
  //           <Link to={item.linkTo} className={styles.link}>
  //             <IconButton size="large" aria-label={item.label} color="inherit">
  //               <item.Icon />
  //             </IconButton>
  //           </Link>
  //           <Link to={item.linkTo} className={styles.link}>
  //             <p>{item.label}</p>
  //           </Link>
  //         </MenuItem>
  //       ))}
  //     </>
  //   )
  // }

  return (
    <>
      {items.map((item: NavItem) => (
        <Link
          href={item.linkTo}
          className={clsx("item", "link")}
          key={item.label}
        >
          <IconButton size="large" aria-label={item.label} color="inherit">
            <item.Icon />
            <p className="label">{item.label}</p>
          </IconButton>
        </Link>
      ))}
    </>
  );
};
export default NavBar;
