import { cn } from '@shared/lib'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type Props = {
	children: React.ReactNode
	isOpen: boolean
	onClose: () => void
	className?: string
}

export const AppModal = ({ children, isOpen, onClose, className }: Props) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	if (!isOpen) return null

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}
	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			onClick={handleOverlayClick}
		>
			<div
				className={cn(
					'relative bg-zinc-900 rounded-lg border border-zinc-700 max-w-md w-full mx-4',
					className,
				)}
				onClick={e => e.stopPropagation()}
			>
				{children}
			</div>
		</div>,
		document.body,
	)
}
