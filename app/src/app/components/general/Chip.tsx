interface ChipProps {
  children: React.ReactNode | React.ReactNode[];
  variant?: "error" | "warning";
  outlined?: boolean;
  className?: string;
}

export const Chip = ({
  children,
  variant,
  className = "",
  outlined,
}: ChipProps) => {
  const classNameExtended = outlined
    ? `${className}
    text-${variant}-foreground bg-inherit text-xs px-3 py-1 rounded-md flex items-center space-x-1`
    : `${className}
      text-${variant}-foreground bg-${variant} text-xs px-3 py-1 rounded-md flex items-center space-x-1`;
  return <div className={classNameExtended}>{children}</div>;
};
