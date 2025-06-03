import { Link } from '@inertiajs/react';
import { EyeIcon } from 'lucide-react';
import { Button } from '@/components/elements/button';

export function ShowButton({ endpoint, id }: { endpoint: string; id: string }) {
  return (
    <Button size="icon" className="cursor-pointer" variant="secondary" aria-label="Show">
      <Link href={route(`${endpoint}s.show`, id)}>
        <EyeIcon className="h-4 w-4" />
      </Link>
    </Button>
  );
}
