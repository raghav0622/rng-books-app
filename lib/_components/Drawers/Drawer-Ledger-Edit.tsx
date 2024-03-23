import { Book } from '@/_schema';
import { RNGDrawer, RNGDrawerProps, useDevice } from '@rng-apps/forms';
import FormBookEditLegder from '../Forms/Form-Book-Edit-Ledger';

const DrawerBookEdit: React.FC<{
  trigger: RNGDrawerProps['trigger'];
  book: Book;
}> = ({ trigger, book }) => {
  const { isDesktop } = useDevice();

  return (
    <RNGDrawer
      drawerProps={{
        offset: 8,
        radius: 'md',
        position: isDesktop ? 'right' : 'bottom',
        title: 'Edit Book',
      }}
      content={(close) => {
        if (book.type === 'Ledger') {
          return <FormBookEditLegder previous={book} onSuccess={close} />;
        }
        return null;
      }}
      trigger={trigger}
    />
  );
};

export default DrawerBookEdit;
