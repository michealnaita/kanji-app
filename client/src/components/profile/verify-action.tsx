import { useForm } from 'react-hook-form';
import cn from 'classnames';
export type VerifyActionProps = {
  code: string;
  action: () => void;
  label: string;
  errorMessage: string;
  button: string;
  danger?: true;
};
export default function VerifyAction({
  code,
  label,
  action,
  button,
  danger,
}: VerifyActionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ code: string }>();
  return (
    <form className="space-y-3 " onSubmit={handleSubmit(action)}>
      <div className=" flex flex-col form-group">
        <label className="text-white">{label}</label>
        <input
          type={'text'}
          className={cn('form-input outline', {
            'bg-red-400': errors && errors.code,
          })}
          placeholder="Type here..."
          {...register('code', {
            required: 'required',
            pattern: new RegExp(code),
          })}
        />
      </div>
      <button className={cn({ 'danger-alt': danger, primary: !danger })}>
        {button}
      </button>
    </form>
  );
}
