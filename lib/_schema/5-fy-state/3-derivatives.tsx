import { orderBy } from 'lodash';
import { CompanyFY } from '../1-schema';
import { useFYState } from './1-atoms';

export const stateDerivatives = (fy: CompanyFY, baseUrl: string) => ({
  baseUrl,
  bsGroups: orderBy(
    fy.groups.filter((group) => group && group.type === 'Account'),
    ['groupLevel'],
    ['asc']
  ),
  capitalGroups: orderBy(
    fy.groups.filter((group) => group && group.type === 'Ledger'),
    ['groupLevel'],
    ['asc']
  ),
  selfBooks: fy.books.filter((b) => b.isSelfBook),
  ledgers: fy.books.filter((b) => b.type === 'Ledger'),
  accounts: fy.books.filter((b) => b.type === 'Account'),
  groups: fy.groups,
  createGroupsOption: fy.groups.filter((g) => g.childGroupsPossible === true),
});

export const useFYStateDerivatives = () => {
  const { baseUrl, fy } = useFYState();

  return stateDerivatives(fy, baseUrl);
};
