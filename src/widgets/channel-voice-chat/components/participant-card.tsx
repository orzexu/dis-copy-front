import { useIsSpeaking } from '@livekit/components-react';
import { cn } from '@shared/lib';
import { Avatar } from '@shared/ui';
import { useUsersStore } from '@entities/user/model';
import type { Participant } from 'livekit-client';

type ParticipantCardProps = {
  participant: Participant;
};

export const ParticipantCard = ({ participant }: ParticipantCardProps) => {
  const isSpeaking = useIsSpeaking(participant);
  const { getUserByName } = useUsersStore();
  const user = getUserByName(participant.name || '');
  const avatarUrl = user?.avatarUrl;
  const isLocal = participant.isLocal;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center p-3 rounded-xl overflow-hidden transition-all duration-200",
        isSpeaking
          ? "ring-2 ring-cyan-400 shadow-lg shadow-green-500/30"
          : "border border-zinc-700",
      )}
    >
      {avatarUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-3xl scale-110 opacity-60"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-zinc-800 to-zinc-900" />
      )}

      <div className="relative z-10 flex flex-col items-center">
        <Avatar size="lg" fallback={participant.name || participant.identity} src={avatarUrl} />
        <div className="mt-2 text-center">
          <div className="text-white font-medium drop-shadow-lg">
            {participant.name || participant.identity}
          </div>
          {isLocal && <div className="text-xs text-zinc-200 drop-shadow">Вы</div>}
        </div>
      </div>
    </div>
  );
};