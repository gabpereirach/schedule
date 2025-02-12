"use client"

import Link from "next/link"

const routes = [
	{
		label: "Home",
		href: "/"
	},
	{
		label: "Notes",
		href: "/grade"
	},
	{
		label: "Agenda",
		href: "/schedule"
	},
	{
		label: "To do List",
		href: "/toDoList"
	}
]

export function MainNav() {

	return (
		<div className="hidden md:block">
			<nav className="flex items-center space-x-6 text-sm font-medium">
				{routes.map((route) => (
					<Link
						key={route.href}
						href={route.href}
					>
						{route.label}
					</Link>
				))}
			</nav>
		</div>
	)
}
