import Image from "next/image";
import Link from "next/link";
import React from "react";

const SidebarLogo = () => {
  return (
    <>
      <Link href={"/"} className="flex items-center gap-3 py-4 px-6 ">
        <div className="image-wrapper">
          <Image
            src="/favicon/android-chrome-192x192.png"
            alt="inventory-logo"
            width={60}
            height={60}
            className="rounded"
          />
        </div>
        <h1 className="font-extrabold text-2xl tracking-tight text-black dark:text-white ">
          AHBAB
        </h1>
      </Link>
    </>
  );
};

export default SidebarLogo;
