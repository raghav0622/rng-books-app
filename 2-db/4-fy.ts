import { deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { kebabCase } from 'lodash';
import {
  Book,
  Company,
  CompanyFY,
  Group,
  InitiateFY,
  Transaction,
} from '../1-schema';
import { useFYResource } from './0-resource';
import { useCurrentUser } from './1-user-context';

export const initiateFYAction = (
  id: string,
  companyId: string,
  userId: string,
  { capitalBackForward, cashInHand, startYear }: InitiateFY
) => {
  const profitlossgroup: Group = {
    balance: 0,
    category: 'Ledger',
    balanceDRLabel: 'Net Profit',
    balanceCRLabel: 'Net Loss',
    editable: false,
    exploded: false,
    parentGroup: 'capital',
    groupLevel: 2,
    parentGroupName: 'Capital',
    id: 'profit-and-loss',
    name: 'Profit & Loss',
    recordType: 'Group',
    type: 'Ledger',
    description: null,
    childCount: 0,
    childGroupsPossible: true,
  };

  const capitalGroup: Group = {
    childGroupsPossible: true,
    category: 'Ledger',
    parentGroupName: 'Balance Sheet',
    balance: capitalBackForward,
    balanceCRLabel: 'Capital Error',
    balanceDRLabel: 'Capital Carry Forward',
    editable: false,
    exploded: false,
    parentGroup: 'balance-sheet',
    groupLevel: 1,
    id: 'capital',
    name: 'Capital A/c',
    recordType: 'Group',
    type: 'Ledger',
    description: null,
    childCount: 2,
  };

  const bsGroup: Group = {
    childGroupsPossible: true,
    balance: cashInHand + capitalBackForward,
    balanceCRLabel: 'Surplus',
    balanceDRLabel: 'Short',
    category: 'Balance Sheet',
    editable: false,
    exploded: false,
    parentGroup: companyId,
    groupLevel: 0,
    parentGroupName: companyId,
    id: 'balance-sheet',
    name: 'Balance Sheet',
    recordType: 'Group',
    type: 'Account',
    description: null,
    childCount: 2,
  };

  const accountGroups: Group[] = [
    'Bank Account',
    'Fixed Deposit',
    'Fixed Asset',
  ].map((name) => {
    const payload: Group = {
      balance: 0,
      parentGroupName: 'Balance Sheet',
      //@ts-expect-error dasfasdfad
      category: name,
      balanceCRLabel: 'Transfer to Balance Sheet (Assets)',
      balanceDRLabel: 'Transfer to Balance Sheet (Liabilities)',
      editable: false,
      exploded: false,
      parentGroup: 'balance-sheet',
      groupLevel: 2,
      id: kebabCase(name),
      name,
      recordType: 'Group',
      type: 'Account',
      description: null,
      childCount: 0,
      childGroupsPossible: false,
    };
    return payload;
  });

  const cashOpenTransaction: Transaction = {
    amount: cashInHand,
    date: new Date(startYear, 3, 1),
    id: 'cash-open-entry',
    primaryBook: 'cash-book',
    transactionType: 'carry-entry',
    contra: null,
    description: `Cash Carry from F.Y. ${startYear - 1}-${startYear}`,
    secondaryBook: null,
  };

  const cashBook: Book = {
    balance: cashInHand,
    category: 'Balance Sheet',
    parentGroup: 'balance-sheet',
    parentGroupName: 'Balance Sheet',
    editable: false,
    isBankAccount: false,
    isSelfBook: true,
    id: 'cash-book',
    locked: false,
    name: 'Cash In Hand',
    recordType: 'Book',
    type: 'Account',
    accountNumber: null,
    bankName: null,
    description: null,
    ifscCode: null,
    lastTransactionDate: new Date(startYear, 3, 1),
    transactionCount: 1,
    transactions: [
      {
        ...cashOpenTransaction,
        nextBalance: cashInHand,
        prevBalance: 0,
        serial: 1,
      },
    ],
  };

  const capitalOpenTransaction: Transaction = {
    amount: -capitalBackForward,
    date: new Date(startYear, 3, 1),
    id: 'capital-open-entry',
    primaryBook: 'capital-from-previous-year',
    transactionType: 'carry-entry',
    contra: null,
    description: `Capital Carry from F.Y. ${startYear - 1}-${startYear}`,
    secondaryBook: null,
  };

  const capitalLedger: Book = {
    id: 'capital-from-previous-year',
    parentGroupName: 'Captial',
    type: 'Ledger',
    balance: -capitalBackForward,
    editable: false,
    lastTransactionDate: new Date(startYear, 3, 1),
    locked: false,
    name: `By Capital B/F`,
    transactionCount: 1,
    transactions: [
      {
        ...capitalOpenTransaction,
        nextBalance: -capitalBackForward,
        prevBalance: 0,
        serial: 1,
      },
    ],
    description: null,
    parentGroup: 'capital',
    recordType: 'Book',
    category: 'Ledger',
    isBankAccount: false,
    isSelfBook: false,
    accountNumber: null,
    bankName: null,
    ifscCode: null,
  };

  const fy: CompanyFY = {
    id: id,
    companyId,
    userId,
    locked: false,
    name: 'F.Y. ' + startYear + '-' + (startYear + 1),
    endYear: startYear + 1,
    startYear,
    transactions: [capitalOpenTransaction, cashOpenTransaction],
    groups: [capitalGroup, bsGroup, ...accountGroups, profitlossgroup],
    books: [capitalLedger, cashBook],

    version: 0,
  };

  return fy;
};

export const useFYDB = () => {
  const user = useCurrentUser();

  const { getRef: getFYRef } = useFYResource();

  const initiateFY = async (company: Company, payload: InitiateFY) => {
    const fyId =
      company.id + '-fy-' + payload.startYear + '-' + (payload.startYear + 1);

    const fyRef = getFYRef(fyId);

    const fy = initiateFYAction(fyId, company.id, user.id, payload);

    await setDoc(fyRef, fy);

    return fy;
  };

  const removeFY = async (id: string) => {
    const fyRef = getFYRef(id);

    await deleteDoc(fyRef);
  };

  const updateFY = async (id: string, payload: Partial<CompanyFY>) => {
    const ref = getFYRef(id);

    await updateDoc(ref, { ...payload });
  };

  return {
    initiateFY,
    removeFY,
    getFYRef,
    updateFY,
  };
};
