'use client';

export const groupedit = 'pending';
// import { CreateGroupSchema, GroupDerived } from '@/schema';
// import { useFYStateDerivatives, useGroupActions } from '@/state';
// import { Modal } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { RNGForm } from '@rng-apps/forms';

// const EditGroupForm: React.FC<{
//   group: GroupDerived;
//   customChild: (open: () => void) => React.ReactNode;
// }> = ({ group, customChild }) => {
//   const [opened, { open, close }] = useDisclosure(false);
//   const { bsGroups, capitalGroups, groups } = useFYStateDerivatives();
//   const parentGroup = groups.find((g) => g.id === group.parentGroup?.id || '');
//   const { updateGroup } = useGroupActions();

//   if (!parentGroup) return null;
//   return (
//     <>
//       <Modal
//         opened={opened}
//         onClose={close}
//         title={'Edit Book Data:' + group.name}
//       >
//         <RNGForm
//           className="max-w-sm mx-auto"
//           name="create-group-form"
//           schema={CreateGroupSchema}
//           defaultValues={{
//             parentGroup: parentGroup,
//             name: group.name,
//             description: group.description,
//             expanded: group.expanded,
//             balanceCRLabel: group.balanceCRLabel,
//             balanceDRLabel: group.balanceDRLabel,
//           }}
//           onSubmit={(data) => {
//             updateGroup(group.id, data);
//             close();
//           }}
//           title="Edit Group"
//           submitButton={{ label: 'Save Group' }}
//           uiSchema={[
//             {
//               name: 'parentGroup',
//               type: 'autocomplete-basic',
//               label: 'Parent Group',
//               options:
//                 group.type === 'Account'
//                   ? bsGroups.filter((g) => g.id !== group.id)
//                   : capitalGroups.filter((g) => g.id !== group.id),
//               getOptionLabel: (opt) => opt.name,
//               getOptionValue: (opt) => opt,
//             },
//             {
//               name: 'name',
//               label: `Name of Group`,
//               type: 'text',
//               renderLogic: (data) => !!data.parentGroup,
//               autoFocus: true,
//             },
//             {
//               name: 'description',
//               label: `Description of Group`,
//               type: 'text',
//               renderLogic: (data) => !!data.parentGroup,
//             },
//             {
//               name: 'expanded',
//               label: `Are Group entries to be shown as Single Entries in Parent Group?`,
//               type: 'switch',
//               renderLogic: (data) => !!data.parentGroup,
//             },
//             {
//               name: 'balanceCRLabel',
//               label: `Label if Group Balance >= 0`,
//               type: 'text',

//               renderLogic: (data) =>
//                 Boolean(
//                   !!data.parentGroup && data.parentGroup?.type !== 'Account'
//                 ),

//               valueOnNoRender: ({ parentGroup }) =>
//                 parentGroup?.type === 'Account'
//                   ? 'Transfer to ' + parentGroup?.name + ' (DR)'
//                   : undefined,
//             },
//             {
//               name: 'balanceDRLabel',
//               label: `Label if Group Balance < 0`,
//               type: 'text',
//               renderLogic: (data) =>
//                 Boolean(
//                   !!data.parentGroup && data.parentGroup?.type !== 'Account'
//                 ),

//               valueOnNoRender: ({ parentGroup }) =>
//                 parentGroup?.type === 'Account'
//                   ? 'Transfer to ' + parentGroup?.name + ' (CR)'
//                   : undefined,
//             },
//           ]}
//         />
//       </Modal>
//       {customChild(open)}
//     </>
//   );
// };

// export default EditGroupForm;
