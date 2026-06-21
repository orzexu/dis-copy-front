// features/servers-bar/ui/create-server-form.tsx
import { useState } from 'react';
import { useCreateServer } from '@features/servers-bar/lib';
import { CreateServerData, createServerSchema } from '@features/servers-bar/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput, LoadingSpinner, useModal } from '@shared/ui';
import { useForm } from 'react-hook-form';
import { ServerIconUpload } from '@features/servers-bar/ui';

export const CreateServerForm = () => {
  const [step, setStep] = useState<'name' | 'icon'>('name');
  const [createdServerId, setCreatedServerId] = useState<number | null>(null);
  const { close } = useModal('add-server');
  const { mutate: createServer, isPending } = useCreateServer();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Pick<CreateServerData, 'name'>>({
    resolver: zodResolver(createServerSchema.pick({ name: true })),
    mode: 'onChange',
  });

  const onSubmitName = (data: Pick<CreateServerData, 'name'>) => {
    createServer(
      { name: data.name },
      {
        onSuccess: (server) => {
          setCreatedServerId(server.id);
          setStep('icon');
        },
      }
    );
  };

  const handleComplete = () => {
    close();
  };

  if (step === 'name') {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="font-semibold text-xl">Создать сервер</h2>
        <p className="text-center text-wrap">
          Дайте название вашему серверу. Позже вы сможете добавить иконку.
        </p>
        <form onSubmit={handleSubmit(onSubmitName)} className="w-full">
          <AppInput
            label="Название сервера"
            name="name"
            register={register}
            placeholder="Название сервера"
            error={errors.name}
          />
          {isPending ? (
            <LoadingSpinner className="w-10 h-10 mx-auto mt-4" />
          ) : (
            <AppButton type="submit" text="Далее" disabled={!isValid} className="mt-4 w-full" />
          )}
        </form>
      </div>
    );
  }

  if (step === 'icon' && createdServerId) {
    const serverName = (register as any)?.values?.name || 'Сервер';
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="font-semibold text-xl">Добавить иконку</h2>
        <p className="text-center text-wrap">
          Загрузите изображение для вашего сервера.
        </p>
        <ServerIconUpload
          serverId={createdServerId}
          serverName={serverName}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  return null;
};