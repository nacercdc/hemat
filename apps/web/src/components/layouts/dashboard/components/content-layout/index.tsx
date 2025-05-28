interface Props {
  children: React.ReactNode;
}

export function ContentLayout({ children }: Props) {
  return (
    <div className="bg-card w-full h-fit rounded-md px-4 py-7 flex flex-col gap-4">
      {children}
    </div>
  );
}
