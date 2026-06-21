import { UserResponseDto } from '@entities/user/model';
import { useUpdateProfile } from '@features/settings/lib';
import { PersonalDataFormData, personalDataSchema } from '@features/settings/schemas';
import { AvatarUpload } from '@features/settings/ui';
import { useGetProfile } from '@features/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput } from '@shared/ui';
import { useForm } from 'react-hook-form';

export const PersonalData = () => {
  const { data: user } = useGetProfile();
  const { mutate: updateProfile } = useUpdateProfile();

  const onSubmit = (data: Omit<PersonalDataFormData, 'avatarUrl'>) => {
    updateProfile(data, {
      onSuccess: (updatedUser: UserResponseDto) => {
        reset({
          email: updatedUser.email,
          username: updatedUser.username,
        });
      },
    });
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<Omit<PersonalDataFormData, 'avatarUrl'>>({
    defaultValues: {
      email: user?.email || '',
      username: user?.username || '',
    },
    mode: 'onChange',
    resolver: zodResolver(personalDataSchema.omit({ avatarUrl: true })),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative h-full flex flex-col gap-4">
      <AvatarUpload currentAvatarUrl={user?.avatarUrl} username={user?.username} />

      <AppInput
        label="Email"
        placeholder="Enter new email"
        name="email"
        register={register}
        error={errors.email}
      />
      <AppInput
        label="Username"
        placeholder="Enter new username"
        name="username"
        register={register}
        error={errors.username}
      />
      {isDirty && isValid && (
        <div className="absolute right-1 bottom-1">
          <AppButton type="submit" text="Сохранить" className="w-30" />
        </div>
      )}
    </form>
  );
};