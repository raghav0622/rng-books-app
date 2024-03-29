'use client';
const ActionsGroup: React.FC<{ id: string; page?: boolean }> = ({
  id,
  page,
}) => {
  // const group = useGetDerived().getGroup(id);
  // const { deleteGroup } = useGroupActions();
  return null;

  // return (
  //   <Group className="flex-nowrap flex-shrink-0" gap="xs">
  //     {group.editable && (
  //       <EditGroupForm
  //         group={group}
  //         customChild={(open) =>
  //           page ? (
  //             <RNGButton
  //               onClick={open}
  //               variant="outline"
  //               size="compact-xs"
  //               shortcut="Ctrl+E"
  //               tooltip={`Edit Group: ${group.name}`}
  //             >
  //               Edit Group
  //             </RNGButton>
  //           ) : (
  //             <RNGActionIcon
  //               onClick={open}
  //               variant="outline"
  //               tooltip={`Edit Group: ${group.name}`}
  //             >
  //               <IconEdit />
  //             </RNGActionIcon>
  //           )
  //         }
  //       />
  //     )}
  //     {group.editable && (
  //       <UserConfirmPassword
  //         title={`Delete Group: ${group.name}`}
  //         description={`All data related to this grooup will be deleted.`}
  //         onSuccess={() => deleteGroup(group.id)}
  //       >
  //         {(open) =>
  //           page ? (
  //             <RNGButton
  //               onClick={open}
  //               variant="outline"
  //               size="compact-xs"
  //               color="red"
  //               shortcut="Ctrl+Delete"
  //               tooltip={`Edit Group: ${group.name}`}
  //             >
  //               Delete Group
  //             </RNGButton>
  //           ) : (
  //             <RNGActionIcon
  //               onClick={open}
  //               color="red"
  //               variant="outline"
  //               tooltip={`Delete Group: ${group.name}`}
  //             >
  //               <IconTrash />
  //             </RNGActionIcon>
  //           )
  //         }
  //       </UserConfirmPassword>
  //     )}
  //   </Group>
  // );
};

export default ActionsGroup;
