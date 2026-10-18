import { Dispatch, SetStateAction } from 'react';
import { MapPin } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { cn } from 'lib/utils';
import { COMMAND_LOCATIONS } from 'utils/commandLocation';

type Props = {
  // eslint-disable-next-line no-unused-vars
  handleChangeLocationFilter: (newLocation: string) => void;
  locationFilter: string;
  searchContent: string;
  setSearchContent: Dispatch<SetStateAction<string>>;
};

const triggerClassName =
  'flex h-10 w-full items-center justify-center gap-2 rounded-(--radius) border border-input bg-card px-3 text-sm font-bold text-foreground shadow-sm hover:bg-secondary';

export const NavHeaderLayout = ({
  handleChangeLocationFilter,
  locationFilter,
  searchContent,
  setSearchContent,
}: Props) => (
  <div className="flex flex-col gap-3">
    <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-nowrap">
      <div className="sm:w-50 sm:flex-none">
        <DropdownMenu>
          <DropdownMenuTrigger className={triggerClassName}>
            <MapPin className="h-4 w-4" />
            Local
            {locationFilter && <Dot />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-50">
            {COMMAND_LOCATIONS.map((location) => (
              <DropdownMenuItem
                key={`commands-location-${location}`}
                onSelect={() => handleChangeLocationFilter(location)}
                className={cn(
                  locationFilter === location && 'bg-primary text-primary-foreground focus:bg-primary',
                )}
              >
                {location}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <input
        value={searchContent}
        onChange={(e) => setSearchContent(e.target.value)}
        placeholder="Encontrar comanda..."
        className="h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-1"
      />
    </div>

    {locationFilter && (
      <p className="text-sm text-text-muted">
        Local: <span className="font-bold text-navy">{locationFilter}</span>
      </p>
    )}
  </div>
);

const Dot = () => <span className="h-2 w-2 rounded-full bg-gold" />;
