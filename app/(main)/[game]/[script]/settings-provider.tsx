"use client";

import { atom, useAtom } from "jotai";

const settingsAtom = atom({
	furigana: false,
	localization: false,
});

export const useSettings = () => useAtom(settingsAtom);

export function Settings() {
	const [settings, setSettings] = useSettings();
	return (
		<div className="flex items-center gap-2">
			<Switch
				label="Furigana"
				checked={settings.furigana}
				onChange={() => {}}
			/>
			<Switch
				label="Translation"
				checked={settings.localization}
				onChange={() => {}}
			/>
		</div>
	);
}

function Switch({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<button className="flex items-center gap-2">
			<span className="text-gray-11 font-medium">{label}</span>
			<span className="p-[2px] h-fit inline-flex border border-gray-6 rounded-full">
				<span className="w-6 inline-flex bg-gray-1 rounded-full">
					<span className="w-2.5 h-2.5 rounded-full bg-gray-11" />
				</span>
			</span>
		</button>
	);
}
