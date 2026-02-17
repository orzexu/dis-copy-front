import { useUiStore } from '@shared/model/ui-store'

export const useModal = (id: string) => {
	const { openModal, closeModal, modals, toggleModal } = useUiStore()

	const isOpen = Boolean(modals[id])

	return {
		isOpen,
		open: () => openModal(id),
		close: () => closeModal(id),
		toggle: () => toggleModal(id),
	}
}
