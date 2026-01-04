import { cn } from "@shared/lib"

type AvatarProps = {
	src?: string
	alt?: string
	fallback?: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
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
}: AvatarProps) => {
	const sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-10 h-10',
		lg: 'w-12 h-12',
		xl: 'w-16 h-16',
	}

	const textSizes = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base',
		xl: 'text-lg',
	}

	return (
		<div className="relative inline-block">
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white overflow-hidden',
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className={cn('font-semibold', textSizes[size])}>
            {fallback?.charAt(0).toUpperCase() || 'U'}
          </span>
        )}
      </div>
      
      {isOnline !== undefined && (
        <div
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
	)
}
