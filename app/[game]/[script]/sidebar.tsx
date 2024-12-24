"use client";

import { Game } from "@/app/_lib/script";
import clsx from "clsx";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";

export function Sidebar() {
  const params = useParams<{
    game: Game;
    script: string;
    rowNumber: string;
  }>();
  const pathname = usePathname();
  const last = pathname.split("/").at(-1);
  const active = last === params.rowNumber ? "words" : last;
  const baseUrl = `/${params.game}/${params.script}/${params.rowNumber}`;
  return (
    <div>
      <ButtonTab href={baseUrl} active={active === "words"}>
        <svg
          className="translate-y-[2px]"
          width="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.00026 3C8.55255 3 9.00026 3.44772 9.00026 4V5H12.0003C12.5525 5 13.0003 5.44772 13.0003 6C13.0003 6.55228 12.5525 7 12.0003 7H11.3727C11.0603 8.91166 10.444 10.5244 9.43746 11.8188C10.1884 12.3437 11.1113 12.7471 12.2428 13.0299C12.7786 13.1639 13.1044 13.7068 12.9704 14.2426C12.8365 14.7784 12.2936 15.1042 11.7578 14.9702C10.2969 14.605 9.04102 14.0424 8.0002 13.245C6.9594 14.0424 5.70353 14.6049 4.24277 14.9701C3.70698 15.1041 3.16404 14.7783 3.03009 14.2425C2.89615 13.7067 3.22191 13.1638 3.7577 13.0299C4.88916 12.747 5.81207 12.3436 6.56298 11.8188C5.55648 10.5244 4.94023 8.91163 4.62781 7H4.00026C3.44798 7 3.00026 6.55228 3.00026 6C3.00026 5.44772 3.44798 5 4.00026 5H7.00026V4C7.00026 3.44772 7.44798 3 8.00026 3ZM6.65822 7C6.92421 8.41424 7.37395 9.52718 8.00023 10.4013C8.62654 9.52718 9.07629 8.41425 9.34229 7H6.65822ZM15.157 11.3008C15.8441 9.66894 18.1564 9.66895 18.8435 11.3008L21.9219 18.6119C22.1362 19.1209 21.8973 19.7073 21.3883 19.9216C20.8793 20.1359 20.2929 19.897 20.0786 19.388L19.4942 18H14.5063L13.9219 19.388C13.7076 19.897 13.1212 20.1359 12.6122 19.9216C12.1032 19.7073 11.8643 19.1209 12.0786 18.6119L15.157 11.3008ZM15.3484 16H18.6521L17.0003 12.0769L15.3484 16Z"
            fill="currentColor"
          />
        </svg>
      </ButtonTab>
      <ButtonTab href={`${baseUrl}/notes`} active={active === "notes"}>
        <svg
          width="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 20V17C15 15.8954 15.8954 15 17 15H20M9 9H15M9 13H11M20 15.1716V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H15.1716C15.702 20 16.2107 19.7893 16.5858 19.4142L19.4142 16.5858C19.7893 16.2107 20 15.702 20 15.1716Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ButtonTab>
      <ButtonTab href={`${baseUrl}/chat`} active={active === "chat"}>
        <svg
          width="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.8864 2.34512C18.8642 2.14869 18.6981 2.0002 18.5004 2C18.3027 1.9998 18.1363 2.14794 18.1137 2.34433C18.0082 3.25861 17.7367 3.88584 17.3113 4.31127C16.8858 4.7367 16.2586 5.00822 15.3443 5.11367C15.1479 5.13632 14.9998 5.30271 15 5.5004C15.0002 5.69809 15.1487 5.86417 15.3451 5.88642C16.2439 5.98823 16.8855 6.25969 17.3217 6.68804C17.7556 7.11407 18.0322 7.74041 18.1126 8.64552C18.1305 8.84634 18.2988 9.00023 18.5004 9C18.702 8.99977 18.8701 8.84551 18.8874 8.64465C18.9645 7.75483 19.2409 7.11438 19.6776 6.67764C20.1144 6.24091 20.7548 5.96446 21.6446 5.88744C21.8455 5.87005 21.9998 5.70205 22 5.50044C22.0002 5.29883 21.8463 5.13048 21.6455 5.11264C20.7404 5.03224 20.1141 4.75557 19.688 4.3217C19.2597 3.88545 18.9882 3.24394 18.8864 2.34512Z"
            fill="currentColor"
          />
          <path
            d="M11.9936 4.88745C11.9364 4.38234 11.5094 4.00052 11.001 4C10.4927 3.99948 10.0648 4.38042 10.0066 4.88542C9.73542 7.23644 9.03724 8.84929 7.94327 9.94327C6.8493 11.0372 5.23644 11.7354 2.88542 12.0066C2.38042 12.0648 1.99948 12.4927 2 13.001C2.00052 13.5094 2.38234 13.9364 2.88745 13.9936C5.19871 14.2554 6.8483 14.9535 7.97008 16.055C9.08576 17.1505 9.79718 18.761 10.0039 21.0885C10.0498 21.6049 10.4827 22.0006 11.0011 22C11.5196 21.9994 11.9516 21.6027 11.9963 21.0862C12.1943 18.7981 12.9052 17.1513 14.0282 16.0282C15.1513 14.9052 16.7981 14.1943 19.0862 13.9963C19.6027 13.9516 19.9994 13.5196 20 13.0011C20.0006 12.4827 19.6049 12.0498 19.0885 12.0039C16.761 11.7972 15.1505 11.0858 14.055 9.97008C12.9535 8.8483 12.2554 7.19871 11.9936 4.88745Z"
            fill="currentColor"
          />
        </svg>
      </ButtonTab>
    </div>
  );
}

function ButtonTab({
  onClick,
  href,
  active,
  children,
}: {
  onClick?: () => void;
  href?: string;
  active?: boolean;
  children?: ReactNode;
}) {
  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          "flex items-center justify-center w-9 h-9 rounded-md border border-transparent",
          active
            ? "bg-gray-1 border-gray-6 shadow-sm"
            : "hover:bg-gray-3 text-gray-10"
        )}
        scroll={false}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center w-8 h-8 rounded-md first:rounded-t-[20px] last:rounded-b-[20px]",
        active ? "bg-green-10 text-sand-1" : "hover:bg-sand-4 text-sand-11"
      )}
    >
      {children}
    </button>
  );
}
