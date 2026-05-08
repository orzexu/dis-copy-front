import { useRemoteParticipants, useLocalParticipant } from '@livekit/components-react';
import { ParticipantCard } from '@widgets/channel-voice-chat/components/participant-card';

export const ParticipantsList = () => {
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();

  const allParticipants = [
    localParticipant,
    ...remoteParticipants,
  ].filter(Boolean)

  if (allParticipants.length === 0) {
    return <div className="text-zinc-500 text-center">Никого нет в канале</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allParticipants.map(participant => (
        <ParticipantCard key={participant.identity} participant={participant} />
      ))}
    </div>
  );
};