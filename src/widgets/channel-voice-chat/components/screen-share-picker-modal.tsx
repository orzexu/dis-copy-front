import { useEffect, useState } from 'react';
import { AppModal } from '@shared/ui';

type ScreenSource = {
  id: string;
  name: string;
  thumbnail: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onStartSharing: (sourceId: string) => void;
};

export const ScreenSharePickerModal = ({ isOpen, onClose, onStartSharing }: Props) => {
  const [sources, setSources] = useState<ScreenSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<ScreenSource | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadSources = async () => {
      try {
        // @ts-ignore
        const fetched = await window.electronAPI.getScreenSources();
        setSources(fetched);
      } catch (error) {
        console.error('Не удалось загрузить источники экрана:', error);
      }
    };
    loadSources();
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedSource) {
      onStartSharing(selectedSource.id);
      onClose();
    }
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} className='max-w-3/4'>
      <div className="flex flex-col gap-4 p-2">
        <h2 className="text-lg font-semibold">Выберите источник экрана</h2>
        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
          {sources.map((source) => (
            <div
              key={source.id}
              className={`p-2 border rounded cursor-pointer transition-colors ${
                selectedSource?.id === source.id ? 'border-cyan-400 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500'
              }`}
              onClick={() => setSelectedSource(source)}
            >
              <img src={source.thumbnail} alt={source.name} className="w-full h-auto rounded" />
              <p className="text-xs text-center truncate mt-1">{source.name}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600">
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSource}
            className="px-4 py-2 rounded text-zinc-800 bg-cyan-600 hover:bg-cyan-400 disabled:opacity-50"
          >
            Начать трансляцию
          </button>
        </div>
      </div>
    </AppModal>
  );
};