"use client";

import { useParams } from "next/navigation";
import type { Game } from "../_lib/script";

const mapGameToTitle = {
	sky: "Trails in the Sky",
};

export function Navbar() {
	const params = useParams<{ game: Game; script?: string }>();
	return (
		<h1 className="font-medium text-gray11 flex items-center gap-2">
			<span>{mapGameToTitle[params.game]}</span>
			{params.script && (
				<>
					<span>•</span>
					<span className="text-gray-10">{params.script}</span>
				</>
			)}
		</h1>
	);
}
