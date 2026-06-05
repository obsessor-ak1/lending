"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, createContext, useContext } from "react";
import styles from "./dashboard.module.css";

const NAV_ITEMS = [
  { label: "Dashboard",      href: "/dashboard",               icon: "bi-grid" },
  { label: "Applications",   href: "/dashboard/applications",  icon: "bi-file-text" },
  { label: "Requests",       href: "/dashboard/requests",      icon: "bi-arrow-left-right" },
  { label: "Browse Lenders", href: "/dashboard/browse",        icon: "bi-people" },
];

export const SessionContext = createContext(null);

export function useSession() {
  return useContext(SessionContext);
}

export default function DashboardLayoutClient({ children, userId }) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        window.location.href = "/auth?mode=login";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <SessionContext.Provider value={{ userId }}>
      <div className="min-h-screen flex flex-col bg-[#F8F5F0] font-[family-name:var(--font-plus-jakarta)]">

        {/* ── NAVBAR ── */}
        <nav className="sticky top-0 z-40 bg-white border-b border-[rgba(245,166,35,0.2)] px-4 md:px-6">
          <div className="flex items-center h-[60px] gap-4">

            {/* Brand */}
            <Link href="/dashboard" className="flex items-center gap-2 text-[#16120A] no-underline shrink-0">
              <div className={styles.brandBee}>🐝</div>
              <span className="font-extrabold text-[1.15rem] tracking-tight hidden sm:block">
                Borrow<span className="text-[#C8841A]">Bee</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-1 mx-auto list-none p-0 m-0">
              {NAV_ITEMS.map(({ label, href, icon }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold no-underline transition-all
                        ${active ? styles.navLinkActive : styles.navLink}`}
                    >
                      <i className={`bi ${icon} text-[0.85rem]`} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-3 ml-auto md:ml-0" ref={dropdownRef}>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden flex flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`block h-0.5 w-5 bg-[#6B5E45] transition-all ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`block h-0.5 w-5 bg-[#6B5E45] transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-[#6B5E45] transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </button>

              {/* Avatar */}
              <div className="relative">
                <button
                  className={styles.avatarBtn}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  JD
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <Link href="/dashboard/profile" className={styles.dropdownItem}>
                      <i className="bi bi-person text-[#6B5E45]" />
                      Profile
                    </Link>
                    <a href="/dashboard/settings" className={styles.dropdownItem}>
                      <i className="bi bi-gear text-[#6B5E45]" />
                      Settings
                    </a>
                    <hr className={styles.dropdownDivider} />
                    <button
                      onClick={handleLogout}
                      className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    >
                      <i className="bi bi-box-arrow-right" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile nav menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-[rgba(245,166,35,0.15)] py-2 flex flex-col gap-1">
              {NAV_ITEMS.map(({ label, href, icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold no-underline
                      ${active ? styles.navLinkActive : styles.navLink}`}
                  >
                    <i className={`bi ${icon}`} />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

      </div>
    </SessionContext.Provider>
  );
}
