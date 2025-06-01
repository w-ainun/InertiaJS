import { NavItem } from '@/types';
import { NavMenu } from './nav-menu';

const langgananItems: NavItem[] = [
  {
    title: 'Biaya Langganan',
    href: '/subcription/purchase',
  },
  {
    title: 'Aktivasi Token',
    href: '/token/activation',
  },
];

export function RootNavMain() {
  return (
    <div className="flex items-center gap-2">
      <NavMenu title="Learning Path" href="/learning-paths?redirect=true" />
      <NavMenu type="dropdown" title="Langganan" items={langgananItems} />
      <NavMenu title="Forum Diskusi" href="/discussions" />
    </div>
  );
}