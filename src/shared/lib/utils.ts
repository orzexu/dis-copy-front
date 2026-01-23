import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useState, useEffect } from 'react'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatMessageTime(date: string | Date): string {
	const messageDate = new Date(date)
	const now = new Date()
	const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

	if (diffInHours < 24) {
		return messageDate.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
		})
	} else if (diffInHours < 48) {
		return 'yesterday'
	} else {
		return messageDate.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
		})
	}
}

export const useDebounce = <T>(value: T, delay: number): T => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => clearTimeout(handler)
	}, [value, delay])

	return debouncedValue
}
