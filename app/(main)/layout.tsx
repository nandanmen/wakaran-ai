import type { CSSProperties } from "react";
import { Navbar } from "./[game]/navbar";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className="grid grid-cols-[--grid]"
			style={
				{
					"--grid": "180px 1fr 72px",
				} as CSSProperties
			}
		>
			<div className="col-start-1 row-start-1 col-span-3 border-b border-dashed border-gray-6" />
			<nav className="col-start-2 row-start-1 h-12 flex items-center justify-between px-4 text-sm">
				<Navbar />
			</nav>
			<div className="col-start-1 row-start-1 row-span-2 border-r border-dashed border-gray-6" />
			<div className="col-start-3 row-start-1 row-span-2 border-l border-dashed border-gray-6" />
			<div className="col-start-1 row-start-2 col-span-3 h-[calc(100vh-theme(space.12))]">
				{children}
			</div>
		</div>
	);
}
