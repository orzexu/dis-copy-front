import { HeartIcon, PlusIcon, ServerIcon } from '@heroicons/react/16/solid'
import { cn } from '@shared/lib'
import React from 'react'

type Props = {
	hoverText?: string
	style: 'create-server' | 'server-list' | 'home'
	serverLogoLink?: string
	onClick?: () => void
}

export const ServerButton = React.memo(
	({ hoverText, style, serverLogoLink, onClick }: Props) => {
		return (
			<div className="group relative">
				<button
					className={cn(
						'flex items-center justify-center w-12 h-12 rounded-3xl bg-zinc-800 hover:bg-gray-700 hover:rounded-2xl transition-all duration-200',
						style === 'home' && 'bg-purple-600 hover:bg-purple-500 text-white',
					)}
					onClick={onClick}
				>
					{style === 'create-server' && <PlusIcon className="w-6 h-6" />}
					{style === 'home' && <HeartIcon className="w-8 h-8" />}

					{style === 'server-list' && (
						<>
							{serverLogoLink ? (
								<img
									src={serverLogoLink}
									alt="server-logo"
									className="w-full h-full object-cover rounded-3xl group-hover:rounded-2xl transition-all duration-200"
								/>
							) : (
								<ServerIcon className="w-6 h-6 text-gray-300" />
							)}
						</>
					)}
				</button>

				{hoverText && (
					<div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 rounded-md bg-zinc-900 text-white text-sm whitespace-nowrap border border-zinc-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
						{hoverText}
						<div
							className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 
                    border-t-8 border-b-8 border-r-8 
                    border-t-transparent border-b-transparent border-r-zinc-900 z-11"
						/>
						<div
							className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 
                    border-t-8 border-b-8 border-r-8 
                    border-t-transparent border-b-transparent border-r-zinc-500 z-10"
						/>
					</div>
				)}
			</div>
		)
	},
)
