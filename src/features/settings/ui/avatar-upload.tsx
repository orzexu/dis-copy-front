import { useUploadAvatar } from "@features/user"
import { CameraIcon } from "@heroicons/react/16/solid"
import { Avatar, LoadingSpinner } from "@shared/ui"
import { useRef, useState } from "react"

type Props = {
	currentAvatarUrl?: string
	username?: string
}

export const AvatarUpload = ({ currentAvatarUrl, username }: Props) => {
	const [preview, setPreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { mutate: uploadAvatar, isPending } = useUploadAvatar()

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const objectUrl = URL.createObjectURL(file)
		setPreview(objectUrl)

		uploadAvatar(file, {
			onSuccess: () => {
				setPreview(null)
			},
			onError: () => {
				setPreview(null)
				alert('Ошибка загрузки')
			},
		})
	}

	const triggerFileSelect = () => {
		fileInputRef.current?.click()
	}

	return (
		<div className="p-2 flex flex-col items-center gap-2">
			<div
				className="relative group cursor-pointer"
				onClick={triggerFileSelect}
			>
				<Avatar
					size="xxl"
					src={preview || currentAvatarUrl}
					fallback={username || 'User'}
					className="ring-2 ring-zinc-700 group-hover:ring-zinc-500 transition-all"
				/>
				<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
					<CameraIcon className="w-6 h-6 text-white" />
				</div>
			</div>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="image/jpeg,image/png,image/gif"
				className="hidden"
				disabled={isPending}
			/>
			{isPending && <LoadingSpinner className="absolute top-15 w-6 h-6" />}
		</div>
	)
}
