interface BookStatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  reading: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  wishlist: "bg-warning/10 text-warning",
};

export function BookStatusBadge({ status }: BookStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${statusStyles[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}
