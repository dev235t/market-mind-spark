
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureHighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <Card className={cn("border-2 border-border hover:border-primary/30 transition-all duration-300", className)}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureHighlight;
