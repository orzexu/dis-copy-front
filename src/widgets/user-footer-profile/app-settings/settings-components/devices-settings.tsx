import { useEffect, useState } from 'react'
import { Divider } from '@shared/ui'
import { useDevicesSettingsStore } from '@features/divices-settings/model'

export const DevicesSettings = () => {
	const {
		microphoneId,
		speakerId,
		inputVolume,
		outputVolume,
		cameraId,
		setMicrophone,
		setSpeaker,
		setInputVolume,
		setOutputVolume,
		setCamera,
	} = useDevicesSettingsStore()

	const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadDevices = async () => {
			try {
				await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
				const allDevices = await navigator.mediaDevices.enumerateDevices()
				setDevices(allDevices)
				setError(null)
			} catch (err) {
				console.error('Failed to access media devices:', err)
				setError(
					'Не удалось получить доступ к устройствам. Проверьте настройки конфиденциальности ОС.',
				)
				setDevices([])
			}
		}

		loadDevices()
	}, [])

	const audioInputs = devices.filter(device => device.kind === 'audioinput')
	const audioOutputs = devices.filter(device => device.kind === 'audiooutput')
	const videoInputs = devices.filter(device => device.kind === 'videoinput')

	return (
		<div className="p-4 space-y-6 text-zinc-300">
			{error && (
				<div className="text-red-400 bg-red-900/20 p-4 rounded mb-4">
					<p>⚠️ {error}</p>
				</div>
			)}

			<div className="space-y-2">
				<label className="text-sm font-semibold text-zinc-100">
					Устройство ввода (Микрофон)
				</label>
				<select
					value={microphoneId || 'Устройства не обнаружены'}
					onChange={e => setMicrophone(e.target.value)}
					className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
					disabled={audioInputs.length === 0}
				>
					<option value="">По умолчанию (Системный)</option>
					{audioInputs.map(device => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label || `Микрофон ${device.deviceId.slice(0, 5)}...`}
						</option>
					))}
				</select>

				<div className="mt-2">
					<div className="flex justify-between text-xs mb-1">
						<span>Чувствительность микрофона</span>
						<span>{Math.round(inputVolume * 100)}%</span>
					</div>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={inputVolume}
						onChange={e => setInputVolume(parseFloat(e.target.value))}
						className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
						disabled={audioInputs.length === 0}
					/>
				</div>
			</div>

			<Divider type="horizontal" />

			<div className="space-y-2">
				<label className="text-sm font-semibold text-zinc-100">
					Устройство вывода (Динамики)
				</label>
				<select
					value={speakerId || 'Устройства не обнаружены'}
					onChange={e => setSpeaker(e.target.value)}
					className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
					disabled={audioOutputs.length === 0}
				>
					<option value="">По умолчанию (Системный)</option>
					{audioOutputs.map(device => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label || `Динамики ${device.deviceId.slice(0, 5)}...`}
						</option>
					))}
				</select>

				<div className="mt-2">
					<div className="flex justify-between text-xs mb-1">
						<span>Громкость динамика</span>
						<span>{Math.round(outputVolume * 100)}%</span>
					</div>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={outputVolume}
						onChange={e => setOutputVolume(parseFloat(e.target.value))}
						className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
						disabled={audioOutputs.length === 0}
					/>
				</div>
			</div>

			<Divider type="horizontal" />

			<div className="space-y-2 opacity-75">
				<label className="text-sm font-semibold text-zinc-100">
					Камера (Видео)
				</label>
				<select
					value={cameraId || 'Устройства не обнаружены'}
					onChange={e => setCamera(e.target.value)}
					className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
					disabled
				>
					<option value="">По умолчанию</option>
					{videoInputs.map(device => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label || `Камера ${device.deviceId.slice(0, 5)}...`}
						</option>
					))}
				</select>
				<p className="text-xs text-zinc-500">
					Настройки видео будут доступны в обновлении
				</p>
			</div>

			<div className="pt-4">
				<button
					onClick={() => window.location.reload()}
					className="text-xs text-zinc-500 hover:text-zinc-300 underline"
				>
					Перезагрузить страницу (проверка сохранения)
				</button>
			</div>
		</div>
	)
}
