import { Gem } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <Badge variant="outline" className={cn("border-yellow-400/50 bg-yellow-400/10 text-yellow-500 dark:text-yellow-400 font-semibold", className)}>
      <Gem className="mr-2 h-4 w-4" />
      Premium Feature
    </Badge>
  );
}
