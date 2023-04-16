import cn from 'classnames';
import { TfiAngleLeft } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
type CardProps = {
  title: string;
  children: any;
  button?: JSX.Element;
  className?: string;
};

export default function CardTwo({
  title,
  children,
  button,
  className,
}: CardProps) {
  const navigate = useNavigate();
  return (
    <div className={cn('flex flex-col space-y-8', className)}>
      <button
        onClick={() => navigate(-1)}
        className="flex space-x-4 items-center text-white"
      >
        <TfiAngleLeft size={20} />{' '}
        <p className="font-semibold text-lg">{title}</p>
      </button>
      <>
        {children}
        {button && button}
      </>
    </div>
  );
}
