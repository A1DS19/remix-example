import { Link } from "@remix-run/react";

interface INavbarProps {
  children: React.ReactNode;
}

export function Navbar({ children }: INavbarProps) {
  return (
    <>
      <nav className="px-10 pt-5">
        <Link to={"/"} prefetch="intent">
          Move<span className="text-teal-500">DB</span>
        </Link>
      </nav>
      <main>{children}</main>
    </>
  );
}
