import { Book, useBookActions } from '@/_schema';
import { RNGButton } from '@rng-apps/forms';
import DrawerBookEdit from '../Drawers/Drawer-Ledger-Edit';

const ActionsBook: React.FC<{ book: Book }> = ({ book }) => {
  const { deleteBook } = useBookActions();
  if (!book || book.id === 'capital-from-previous-year' || !book.editable)
    return null;

  return (
    <div className="flex gap-1 flex-nowrap items-center">
      <DrawerBookEdit
        book={book}
        trigger={(open) => (
          <RNGButton
            color="gray"
            variant="light"
            onClick={open}
            tooltip={`Edit ${book.type}: ${book.name}`}
          >
            Edit
          </RNGButton>
        )}
      />

      <RNGButton
        onClick={() => deleteBook(book.id)}
        color="gray"
        variant="light"
        tooltip={`Delete ${book.type}: ${book.name}`}
      >
        Delete
      </RNGButton>
    </div>
  );

  return null;
};
// }

//   const menuContent = (
//     <Menu shadow="sm">
//       <Menu.Target>
//         <RNGActionIcon
//           variant="outline"
//           size="sm"
//           color="gray"
//           tooltip={'Actions for ' + book.name}
//         >
//           <IconDotsVertical />
//         </RNGActionIcon>
//       </Menu.Target>
//       <Menu.Dropdown>
//         <Menu.Label>Actions for {book.name}</Menu.Label>

//         <DrawerBookEdit
//           book={book}
//           customChild={(open) => (
//             <Menu.Item
//               onClick={open}
//               leftSection={<IconEdit style={{ width: '75%', height: '75%' }} />}
//             >
//               Edit Book
//             </Menu.Item>
//           )}
//         />
//         <UserConfirmPassword
//           title={`Delete Book: ${book.name}`}
//           description={`All data related to this book will be deleted.`}
//           onSuccess={() => deleteBook(book.id)}
//         >
//           {(open) => (
//             <Menu.Item
//               onClick={open}
//               color="red"
//               leftSection={
//                 <IconTrash style={{ width: '75%', height: '75%' }} />
//               }
//             >
//               Delete Book
//             </Menu.Item>
//           )}
//         </UserConfirmPassword>
//       </Menu.Dropdown>
//     </Menu>
//   );

//   return menu ? (
//     menuContent
//   ) : (
//     <Group className="flex-nowrap flex-shrink-0" gap="xs">
//       <DrawerBookEdit
//         book={book}
//         customChild={(open) => (
//           <RNGButton
//             onClick={open}
//             variant="outline"
//             size="compact-xs"
//             shortcut="Ctrl+E"
//             tooltip={`Edit Book: ${book.name}`}
//           >
//             Edit Book
//           </RNGButton>
//         )}
//       />
//       <UserConfirmPassword
//         title={`Delete Book: ${book.name}`}
//         description={`All data related to this book will be deleted.`}
//         onSuccess={() => deleteBook(book.id)}
//       >
//         {(open) => (
//           <RNGButton
//             onClick={open}
//             variant="outline"
//             size="compact-xs"
//             color="red"
//             shortcut="Ctrl+Delete"
//             tooltip={`Edit Book: ${book.name}`}
//           >
//             Delete Book
//           </RNGButton>
//         )}
//       </UserConfirmPassword>
//     </Group>
//   );
// };

export default ActionsBook;
