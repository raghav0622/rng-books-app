import {
  Book,
  UpdateBookMetaSchema,
  useBookActions,
  useFYStateDerivatives,
  useUserAutoCompleteDataDB,
} from '@/_schema';
import { modals } from '@mantine/modals';
import { RNGForm } from '@rng-apps/forms';

const DrawerBookEdit: React.FC<{
  book: Book;
  customChild: (open: () => void) => React.ReactNode;
}> = ({ book, customChild }) => {
  const { updateBookMeta } = useBookActions();
  const { bsGroups, capitalGroups, groups } = useFYStateDerivatives();
  const parentGroup = groups.find((g) => g.id === book.parentGroup);
  const { options, addOption } = useUserAutoCompleteDataDB('bank-name');
  const { options: ifscOptions, addOption: addIfscOptions } =
    useUserAutoCompleteDataDB('bank-ifsc');
  if (!parentGroup) return null;

  const openModal = () =>
    modals.open({
      title: 'Edit Book ' + book.name,
      centered: true,
      modalId: 'edit-book' + book.id,
      children: (
        <RNGForm
          name="edit-book-data"
          schema={UpdateBookMetaSchema}
          defaultValues={{
            accountNumber: book.accountNumber || undefined,
            bankDetail: book.bankDetail || false,
            bankName: book.bankName || undefined,
            description: book.description || undefined,
            ifscCode: book.ifscCode || undefined,
            isSelfAccount: book.isSelfAccount || false,
            name: book.name || undefined,
            parentGroup: parentGroup || undefined,
          }}
          onChange={(d) => console.log(d)}
          uiSchema={[
            {
              name: 'parentGroup',
              type: 'autocomplete-basic',
              label: 'Parent Group',
              options: book.type === 'Account' ? bsGroups : capitalGroups,
              getOptionLabel: (opt) => opt.name,
              getOptionValue: (opt) => opt,
            },

            {
              name: 'name',
              label: `Name of Book`,
              type: 'text',
              renderLogic: ({ parentGroup }) => !!parentGroup,
              autoFocus: true,
            },
            {
              name: 'description',
              label: `Description of Book`,
              type: 'text',
              renderLogic: ({ parentGroup }) => !!parentGroup,
            },
            {
              name: 'isSelfAccount',
              label: 'Is Account of Self',
              type: 'switch',
              renderLogic: ({ parentGroup }) => {
                if (
                  parentGroup.type === 'Account' &&
                  parentGroup.id !== 'bank-account' &&
                  parentGroup.id !== 'fixed-deposit' &&
                  parentGroup.id !== 'fixed-asset'
                )
                  return true;
                else return false;
              },
              valueOnNoRender: ({ parentGroup }) => {
                if (parentGroup && parentGroup.type === 'Account') {
                  if (
                    parentGroup.id === 'bank-account' ||
                    parentGroup.id === 'fixed-deposit' ||
                    parentGroup.id === 'fixed-asset'
                  )
                    return true;
                  else return false;
                } else return false;
              },
            },
            {
              name: 'bankDetail',
              label: 'Add Bank Details',
              type: 'switch',
              renderLogic: ({ parentGroup }) => {
                if (parentGroup && parentGroup.type === 'Account') {
                  if (
                    parentGroup.id === 'bank-account' ||
                    parentGroup.id === 'fixed-deposit' ||
                    parentGroup.id === 'fixed-asset'
                  )
                    return false;
                  else return true;
                } else return false;
              },
              valueOnNoRender: ({ parentGroup }) => {
                if (parentGroup && parentGroup.type === 'Account') {
                  if (
                    parentGroup.id === 'bank-account' ||
                    parentGroup.id === 'fixed-deposit'
                  )
                    return true;
                  else return false;
                } else return false;
              },
            },
            {
              name: 'bankName',
              label: 'Bank Name',
              type: 'autocomplete-creatable',
              options: options,
              onCreate: async (p) => await addOption(p),
              renderLogic: (d) => !!d.bankDetail,
              valueOnNoRender: (d) =>
                d.bankDetail ? book.bankName : undefined,
            },
            {
              name: 'ifscCode',
              label: 'Bank IFSC Code',
              type: 'autocomplete-creatable',
              options: ifscOptions,
              onCreate: async (p) => await addIfscOptions(p),
              renderLogic: (d) => !!d.bankDetail,
              valueOnNoRender: (d) =>
                d.bankDetail ? book.ifscCode : undefined,
            },
            {
              name: 'accountNumber',
              label: 'Bank Account No.',
              type: 'text',
              renderLogic: (d) => !!d.bankDetail,
              valueOnNoRender: (d) =>
                d.bankDetail ? book.accountNumber : undefined,
            },
          ]}
          submitButton={{ label: 'Confirm' }}
          onSubmit={({
            bankDetail = false,
            isSelfAccount = false,
            parentGroup,
            ...payload
          }) => {
            updateBookMeta(book.id, {
              ...payload,
              parentGroup: parentGroup.id,
              bankDetail,
              isSelfAccount,
            });
            modals.close('edit-book' + book.id);
          }}
        />
      ),
    });
  return customChild(() => openModal());
};

export default DrawerBookEdit;
