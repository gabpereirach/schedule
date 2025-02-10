import type { Metadata } from "next";
import "./globals.css";
import { MainNav } from "@/components/main-nav";

//title of app
export const metadata: Metadata = {
	title: "Agenda de vie",
	description: "un agenda modulable util à tout le monde et entièrement modifiable au bon vouloir.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr">
			<body>
				<div className="border-b">
					<div className="flex h-16 items-center px-4">
						<div className="flex-1 flex justify-center">
							<MainNav />
						</div>
					</div>
				</div>
				{children}
			</body>
		</html>
	);
}
