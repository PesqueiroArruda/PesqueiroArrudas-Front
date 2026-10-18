import { CommandsContext } from 'pages-components/Commands';
import { useCallback, useContext } from 'react';
import { NavHeaderLayout } from './layout';

export const NavHeader = () => {
  const { locationFilter, setLocationFilter, searchContent, setSearchContent } =
    useContext(CommandsContext);

  const handleChangeLocationFilter = useCallback(
    (newLocation: string) => {
      setLocationFilter((prev) => (prev === newLocation ? '' : newLocation));
    },
    [setLocationFilter]
  );

  return (
    <NavHeaderLayout
      handleChangeLocationFilter={handleChangeLocationFilter}
      locationFilter={locationFilter}
      searchContent={searchContent}
      setSearchContent={setSearchContent}
    />
  );
};
