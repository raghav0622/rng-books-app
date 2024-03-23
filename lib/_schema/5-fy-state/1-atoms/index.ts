import {
  useAtomFamilyStateAPI,
  useAtomStateAPI,
  useIdsStateAPI,
} from '@rng-apps/forms';
import { sortBy } from 'lodash';
import {
  atom,
  atomFamily,
  selector,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';
import {
  Book,
  BookDerived,
  BookTransaction,
  Company,
  CompanyFY,
  Group,
  GroupDerived,
  Transaction,
  TransactionDerived,
} from '../../1-schema';

export const TransactionsIdAtom = atom<string[]>({
  key: 'transaction-ids',
  default: [],
});

export const TransactionsAtomFamily = atomFamily<Transaction, string>({
  key: 'transaction-by-id',
  default: undefined,
});

export const BooksIdAtom = atom<string[]>({
  key: 'book-ids',
  default: [],
});

export const BooksAtomFamily = atomFamily<Book, string>({
  key: 'book-by-id',
  default: undefined,
});

export const GroupsIdAtom = atom<string[]>({
  key: 'group-ids',
  default: [],
});

export const GroupsAtomFamily = atomFamily<Group, string>({
  key: 'group-by-id',
  default: undefined,
});

export const FYMetaStateAtom = atom<
  Omit<CompanyFY, 'books' | 'groups' | 'transactions'>
>({
  key: 'company-fy-meta',
  default: undefined,
});

export const CurrentCompanyAtom = atom<Company>({
  key: 'current-company',
  default: undefined,
});

export const FYDBAtom = atom<CompanyFY>({
  key: 'fy-db-atom',
  default: undefined,
});

export const FYSelector = selector<CompanyFY>({
  key: 'comapny-fy-selector',
  get({ get }) {
    const fyMeta = get(FYMetaStateAtom);
    const bookIds = get(BooksIdAtom);
    const transactionIds = get(TransactionsIdAtom);
    const groupIds = get(GroupsIdAtom);

    const books = bookIds.map((id) => get(BooksAtomFamily(id)));

    const transactions = transactionIds.map((id) =>
      get(TransactionsAtomFamily(id))
    );

    const groups = groupIds.map((id) => get(GroupsAtomFamily(id)));

    const groupsWithBookBalance = groups.map((group) => {
      const bookS = books.filter((book) => book.parentGroup === group.id);
      const booksBalance = bookS.reduce((partialSum, elem) => {
        return partialSum + elem.balance;
      }, 0);

      return { ...group, balance: booksBalance, childCount: bookS.length };
    });

    const groupsWithGroupBalance = groupsWithBookBalance.map((g) => {
      const groupS = groupsWithBookBalance.filter(
        (h) => h.parentGroup === g.id
      );
      const balance = groupS.reduce((partialSum, elem) => {
        const amount = elem.id === 'capital' ? -elem.balance : elem.balance;
        return partialSum + amount;
      }, g.balance || 0);

      if (g.id === 'capital') {
        return {
          ...g,
          balance: -balance,
          childCount: g.childCount + groupS.length,
        };
      } else {
        return {
          ...g,
          balance: balance,
          childCount: g.childCount + groupS.length,
        };
      }
    });

    return {
      ...fyMeta,
      books: books,
      groups: sortBy(groupsWithGroupBalance, ['groupLevel', 'asc']),
      transactions: transactions,
    };
  },
});

export const TransactionsDerivedSelector = selector<Array<TransactionDerived>>({
  key: 'transactions-derived-array-selector',
  get({ get }) {
    const transactionsDerived: Array<TransactionDerived> = get(
      FYSelector
    ).transactions.map((base) => {
      if (base.transactionType === 'carry-entry') {
        return {
          transactionType: base.transactionType,
          amount: base.amount,
          contra: null,
          date: base.date,
          id: base.id,
          primaryBook: get(BooksAtomFamily(base.primaryBook)),
          secondaryBook: null,
          description: base.description,
        };
      } else if (base.transactionType === 'leger-entry') {
        return {
          transactionType: base.transactionType,
          amount: base.amount,
          contra: null,
          date: base.date,
          id: base.id,
          primaryBook: get(BooksAtomFamily(base.primaryBook)),
          secondaryBook: get(BooksAtomFamily(base.secondaryBook)),
          description: base.description,
        };
      } else {
        return {
          transactionType: base.transactionType,
          amount: base.amount,
          contra: get(TransactionsAtomFamily(base.contra)),
          date: base.date,
          id: base.id,
          primaryBook: get(BooksAtomFamily(base.primaryBook)),
          secondaryBook: get(BooksAtomFamily(base.secondaryBook)),
          description: base.description,
        };
      }
    });

    return transactionsDerived;
  },
});

export const BooksDerivedSelector = selector<Array<BookDerived>>({
  key: 'books-derived-array-selector',
  get({ get }) {
    const booksDerived: Array<BookDerived> = get(FYSelector).books.map(
      (base) => {
        const parentGroup = get(GroupsAtomFamily(base.parentGroup));

        return { ...base, parentGroup };
      }
    );

    return booksDerived;
  },
});

export const GroupDerivedSelector = selector<Array<GroupDerived>>({
  key: 'groups-derived-array-selector',
  get({ get }) {
    const fy = get(FYSelector);
    const groupsDerived: Array<GroupDerived> = fy.groups.map((base) => {
      const parentGroup = get(GroupsAtomFamily(base.parentGroup));

      const childBooks = fy.books.filter(
        (book) => book.parentGroup === base.id
      );
      const childGroups = sortBy(
        fy.groups.filter((group) => group.parentGroup === base.id)
      );

      return { ...base, parentGroup, childBooks, childGroups };
    });

    return groupsDerived;
  },
});

export const useTransactionState = () => {
  const {
    addID,
    removeID,
    set: setIds,
    reset: resetIds,
  } = useIdsStateAPI(TransactionsIdAtom);

  const { getAtom, resetAtom, setAtom, updateAtom } = useAtomFamilyStateAPI(
    TransactionsAtomFamily
  );

  const addTransactionState = (transaction: Transaction) => {
    addID(transaction.id);
    setAtom(transaction.id, transaction);
  };

  const deleteTransactionState = (id: string) => {
    removeID(id);
    resetAtom(id);
  };

  return {
    setTransactionIdsState: setIds,
    resetTransactionIdsState: resetIds,
    setTransactionState: setAtom,
    addTransactionState,
    getTransactionState: getAtom,
    updateTransactionState: updateAtom,
    deleteTransactionState,
  };
};

export const useBookState = () => {
  const {
    addID,
    removeID,
    set: setIds,
    reset: resetIds,
  } = useIdsStateAPI(BooksIdAtom);

  const { getAtom, resetAtom, setAtom, updateAtom } =
    useAtomFamilyStateAPI(BooksAtomFamily);

  const addBookState = (book: Book) => {
    addID(book.id);
    setAtom(book.id, book);
  };

  const deleteBookState = (id: string) => {
    removeID(id);
    resetAtom(id);
  };

  const updateBookState = (id: string, payload: (prev: Book) => Book) => {
    updateAtom(id, (prev) => {
      const updatedBook = payload(prev);

      if (updatedBook.transactions.length > 0) {
        const newTransactions: BookTransaction[] = [];

        updatedBook.transactions.forEach((val, i) => {
          const prevBalance = i === 0 ? 0 : newTransactions[i - 1].nextBalance;
          const nextBalance = prevBalance + val.amount;

          newTransactions.push({
            ...val,
            serial: i + 1,
            prevBalance,
            nextBalance,
          } as BookTransaction);
        });

        return {
          ...updatedBook,
          lastTransactionDate:
            newTransactions[newTransactions.length - 1].date || null,
          balance: newTransactions.length
            ? newTransactions[newTransactions.length - 1].nextBalance
            : 0,
          transactionCount: newTransactions.length || 0,
          transactions: newTransactions || [],
        };
      } else {
        return {
          ...updatedBook,
          balance: 0,
          transactionCount: 0,
          transactions: [],
          lastTransactionDate: null,
        };
      }
    });
  };

  return {
    setBookIdsState: setIds,
    resetBookIdsState: resetIds,

    addBookState,
    setBookState: setAtom,
    getBookState: getAtom,
    updateBookState,
    deleteBookState,
  };
};

export const useGroupState = () => {
  const {
    addID,
    removeID,
    set: setIds,
    reset: resetIds,
  } = useIdsStateAPI(GroupsIdAtom);

  const { getAtom, resetAtom, setAtom, updateAtom } =
    useAtomFamilyStateAPI(GroupsAtomFamily);

  const addGroupState = (group: Group) => {
    addID(group.id);
    setAtom(group.id, group);
  };

  const deleteGroupState = (id: string) => {
    removeID(id);
    resetAtom(id);
  };

  return {
    setGroupIdsState: setIds,
    resetGroupIdsState: resetIds,

    setGroupState: setAtom,
    addGroupState,
    getGroupState: getAtom,
    updateGroupState: updateAtom,
    deleteGroupState,
  };
};

export const useFYMetaState = () => {
  const { resetAtom, setAtom, updateAtom, value } =
    useAtomStateAPI(FYMetaStateAtom);

  return {
    resetFYMetaStae: resetAtom,
    setFYMetaState: setAtom,
    updateFYMetaState: updateAtom,
    value,
  };
};

export const useCompanyState = () => {
  const { resetAtom, setAtom, value } = useAtomStateAPI(CurrentCompanyAtom);

  return {
    resetCompany: resetAtom,
    setCompany: setAtom,
    company: value,
  };
};
export const useFYDBState = () => {
  const { resetAtom, setAtom, value } = useAtomStateAPI(FYDBAtom);

  return {
    resetFYDBState: resetAtom,
    setFYDB: setAtom,
    fyDB: value,
  };
};

export const useFYStateBase = () => {
  const state = useRecoilValue(FYSelector);

  return state;
};

export const useFYState = () => {
  const { fyDB } = useFYDBState();
  const { company } = useCompanyState();
  const state = useRecoilValue(FYSelector);
  const baseUrl = `/fy/${state.id}`;

  return { fy: state, fyDB, company, baseUrl };
};

export const useGetDerived = () => {
  const getGroup = useRecoilCallback(({ snapshot }) => (id: string) => {
    const fy = snapshot.getLoadable(GroupDerivedSelector).getValue();

    const group = fy.find((g) => g.id === id);

    return group;
  });

  const getBook = useRecoilCallback(({ snapshot }) => (id: string) => {
    const fy = snapshot.getLoadable(BooksDerivedSelector).getValue();

    const group = fy.find((g) => g.id === id);

    return group;
  });

  const getTransaction = useRecoilCallback(({ snapshot }) => (id: string) => {
    const fy = snapshot.getLoadable(TransactionsDerivedSelector).getValue();

    const group = fy.find((g) => g.id === id);

    return group;
  });

  return { getGroup, getBook, getTransaction };
};
