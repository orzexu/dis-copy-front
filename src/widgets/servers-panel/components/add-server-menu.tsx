import { AppButton } from '@shared/ui'
import { BackButton } from '@widgets/servers-panel/components/back-button'
import { CreateServerFrom } from '@widgets/servers-panel/components/create-server-from'
import { JoinToServer } from '@widgets/servers-panel/components/join-to-server'
import { useState } from 'react'

type TStep = 'null' | 'create' | 'join'

export const AddServerMenu = () => {
	const [whatStep, setWhatStep] = useState<TStep>('null')
	const handleChangeStep = (step: TStep) => {
		setWhatStep(step)
	}
	return (
		<div className="p-2">
			{whatStep === 'null' && (
				<>
					<div className="flex flex-col items-center gap-2">
						<h2 className="font-semibold text-2xl">Создай свой сервер</h2>
						<p className="text-lg text-wrap text-center">
							Ваш сервер — это место, где вы можете тусоваться со своими
							друзьями. Создайте сервер и начните общаться.
						</p>
						<AppButton
							text={'Создать сервер'}
							onClick={() => handleChangeStep('create')}
						/>
					</div>
					<div className="flex flex-col items-center gap-2 mt-6">
						<h2 className="font-semibold text-xl">
							У вас уже есть приглашение?
						</h2>
						<AppButton
							text={'Присоедениться к серверу'}
							onClick={() => handleChangeStep('join')}
						/>
					</div>
				</>
			)}

			{whatStep === 'create' && (
				<>
					<BackButton onClick={() => handleChangeStep('null')} />
					<CreateServerFrom />
				</>
			)}

			{whatStep === 'join' && (
				<>
					<BackButton onClick={() => handleChangeStep('null')} />
					<JoinToServer />
				</>
			)}
		</div>
	)
}
