import { cn } from '@shared/lib'
import React from 'react'

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement> & {
	orientation?: 'vertical' | 'horizontal'
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
	({ className, children, orientation = 'vertical', ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					'overflow-hidden',
					orientation === 'vertical' && 'overflow-y-auto',
					orientation === 'horizontal' && 'overflow-x-auto',
					className
				)}
				{...props}
			>
				<div className="h-full w-full">{children}</div>
			</div>
		)
	}
)

ScrollArea.displayName = 'ScrollArea'
