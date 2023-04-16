export function WithErrorMessage({
  children,
  message,
  className,
}: {
  children: any;
  message: string | false | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <>{children}</>
      {message && <p className="text-red-500 italic text-sm">{message}</p>}
    </div>
  );
}
