import type { Config } from "tailwindcss";
import { createPlugin } from "windy-radix-palette";

const colors = createPlugin();

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)"],
				jp: ["var(--font-jp)"],
			},
		},
	},
	plugins: [colors.plugin],
};
export default config;
