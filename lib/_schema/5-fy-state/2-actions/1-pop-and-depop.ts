import { Company, CompanyFY } from '../../1-schema';
import {
  useBookState,
  useCompanyState,
  useFYDBState,
  useFYMetaState,
  useFYStateBase,
  useGroupState,
  useTransactionState,
} from '../1-atoms';

export const usePopulateAndDepopulateState = () => {
  const { setCompany, resetCompany } = useCompanyState();
  const { resetFYDBState, setFYDB } = useFYDBState();
  const {
    setBookState: populateBook,
    setBookIdsState: populateBookIds,
    deleteBookState: depopulateBook,
    resetBookIdsState: depopulateBookIds,
  } = useBookState();
  const {
    setGroupState: populateGroup,
    setGroupIdsState: populateGroupIds,
    deleteGroupState: depopulateGroup,
    resetGroupIdsState: depopulateGroupIds,
  } = useGroupState();
  const {
    setTransactionState: populateTransaction,
    setTransactionIdsState: populateTransactionIds,
    deleteTransactionState: depopulateTransaction,
    resetTransactionIdsState: depopulateTransactionIds,
  } = useTransactionState();
  const { setFYMetaState: populateFYMeta, resetFYMetaStae: depopulateFYMeta } =
    useFYMetaState();

  const fyState = useFYStateBase();

  const populate = async (company: Company, fy: CompanyFY) => {
    setCompany(company);
    setFYDB(fy);
    populateFYMeta({
      ...fy,
    });

    const bookIds = fy.books.map((b) => {
      populateBook(b.id, b);
      return b.id;
    });
    const groupIds = fy.groups.map((b) => {
      populateGroup(b.id, b);
      return b.id;
    });
    const transactionIds = fy.transactions.map((b) => {
      populateTransaction(b.id, b);
      return b.id;
    });

    populateBookIds(bookIds);
    populateGroupIds(groupIds);
    populateTransactionIds(transactionIds);
  };

  const dePopulate = () => {
    resetCompany();
    resetFYDBState();
    depopulateFYMeta();

    if (fyState.books?.length > 0) {
      fyState.books.forEach((book) => depopulateBook(book.id));
      depopulateBookIds();
    }
    if (fyState.groups?.length > 0) {
      fyState.groups.forEach((group) => depopulateGroup(group.id));
      depopulateGroupIds();
    }
    if (fyState.transactions?.length > 0) {
      fyState.transactions.forEach((transaction) =>
        depopulateTransaction(transaction.id)
      );
      depopulateTransactionIds();
    }
  };

  return { populate, dePopulate };
};
