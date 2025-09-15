import clsx from "clsx";
import Link from "next/link";

import "./styles.css";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  [key: string]: any;
}

const Button = ({ children, className, href, ...props }: ButtonProps) => {
  if (href) {
    return (
      <Link href={href} className={clsx("btn", className)} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={clsx("btn", className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
