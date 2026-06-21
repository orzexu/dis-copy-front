import { cn } from '@shared/lib'
import { useEffect, useState } from 'react'

type Props = {
	src?: string | null
	alt?: string
	fallback?: string
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
	className?: string
	isOnline?: boolean
}

export const Avatar = ({
	alt,
	src,
	fallback,
	size = 'md',
	className,
	isOnline,
}: Props) => {
	const [imageError, setImageError] = useState(false)

	useEffect(() => {
		if (src) {
			setImageError(false)
		}
	}, [src])

	const sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-10 h-10',
		lg: 'w-12 h-12',
		xl: 'w-16 h-16',
    xxl: 'w-32 h-32',
	}

	const textSizes = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base',
		xl: 'text-lg',
    xxl: 'text-2xl',
	}

	const showFallback = !src || imageError

	return (
		<div className="relative inline-block">
			<div
				className={cn(
					'relative flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white overflow-hidden',
					sizeClasses[size],
					className,
				)}
			>
				{showFallback ? (
					<span className={cn('font-semibold', textSizes[size])}>
						{fallback?.charAt(0).toUpperCase() || 'U'}
					</span>
				) : (
					<img
						src={src}
						alt={alt}
						className="w-full h-full object-cover"
						onError={() => setImageError(true)}
					/>
				)}
			</div>

			{isOnline !== undefined && (
				<div
					className={cn(
						'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-grayscale-10',
						isOnline ? 'bg-green-500' : 'bg-grayscale-50',
					)}
				/>
			)}
		</div>
	)
}
