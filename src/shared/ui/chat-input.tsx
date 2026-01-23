import { PaperAirplaneIcon } from '@heroicons/react/16/solid'
import { cn } from '@shared/lib'
import { forwardRef } from 'react'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	onSend?: () => void
	sendDisabled?: boolean
}

export const ChatInput = forwardRef<HTMLTextAreaElement, Props>(
	({ className, onSend, sendDisabled, ...props }, ref) => {
		const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				if (onSend && !sendDisabled) {
					onSend()
				}
			}
		}

		return (
			<div className="relative">
				<textarea
					ref={ref}
					className={cn(
						'flex min-h-12 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 pr-12 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
						className
					)}
					onKeyDown={handleKeyDown}
					rows={1}
					maxLength={2000}
					{...props}
				/>

				<button
					type="button"
					onClick={onSend}
					disabled={sendDisabled}
					className="absolute right-3 bottom-1/2 translate-y-1/2 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
				>
					<PaperAirplaneIcon className="h-8 w-8" />
				</button>
			</div>
		)
	}
)

ChatInput.displayName = 'ChatInput'
