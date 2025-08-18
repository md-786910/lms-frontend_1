import { FileX, Database } from "lucide-react";

const NoDataFound = ({
  icon: Icon = FileX,
  title = "No data found",
  description = "There are no items to display at the moment.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {description}
      </p>
    </div>
  );
};

export default NoDataFound;
