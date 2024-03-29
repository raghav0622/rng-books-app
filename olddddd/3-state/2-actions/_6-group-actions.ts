// import { v4 } from 'uuid';
// import { CreateGroup, Group } from '../../1-schema';
// import { useBookState, useGetDerived, useGroupState } from '../1-atoms';
// import { useFYActions } from './2-fy-actions';

// export const useGroupActions = () => {
//   const {
//     addGroupState,
//     deleteGroupState,
//     updateGroupState,
//     // groups,
//   } = useGroupState();

//   const { fyAction: fyVersionIncrease } = useFYActions();
//   const { getGroup } = useGetDerived();
//   const { updateBookState } = useBookState();

//   const createGroup = (payload: CreateGroup) => {
//     const id = v4();

//     const grouplevel = payload.parentGroup.groupLevel + 1;

//     const group: Group = {
//       balance: 0,
//       editable: true,
//       id,
//       groupLevel: grouplevel,
//       type: payload.parentGroup.type,
//       recordType: 'Group',
//       exploded: payload.exploded,
//       balanceCRLabel: payload.balanceCRLabel,
//       balanceDRLabel: payload.balanceDRLabel,
//       parentGroup: payload.parentGroup.id,
//       name: payload.name,
//       description: payload.description,
//       childCount: 0,
//       childGroupsPossible: true,
//     };
//     addGroupState(group);
//     fyVersionIncrease();

//     return group;
//   };

//   const deleteGroup = (id: string) => {
//     const groupData = getGroup(id);
//     if (!groupData || id === 'balance-sheet' || id === 'capital') return;
//     if (
//       groupData.parentGroup !== undefined &&
//       groupData.parentGroup !== null &&
//       groupData.childBooks.length > 0
//     ) {
//       groupData.childBooks.forEach((book) => {
//         updateBookState(book.id, (prev) => ({
//           ...prev,
//           parentGroup: groupData.parentGroup?.id
//             ? groupData.parentGroup.id
//             : groupData.type === 'Account'
//             ? 'balance-sheet'
//             : 'capital',
//         }));
//       });
//     }

//     if (groupData.childGroups.length > 0) {
//       groupData.childGroups.forEach((group) => {
//         updateGroupState(group.id, (prev) => ({
//           ...prev,
//           parentGroup: groupData.parentGroup?.id
//             ? groupData.parentGroup.id
//             : groupData.type === 'Account'
//             ? 'balance-sheet'
//             : 'capital',
//         }));
//       });
//     }

//     deleteGroupState(id);
//     fyVersionIncrease();
//   };

//   const updateGroup = (
//     id: string,
//     { parentGroup, ...payload }: CreateGroup
//   ) => {
//     updateGroupState(id, (prev) => ({
//       ...prev,
//       ...payload,
//       exploded: payload.exploded,
//       groupLevel: parentGroup.groupLevel + 1,
//       parentGroup: parentGroup.id,
//     }));
//     fyVersionIncrease();
//   };

//   return {
//     deleteGroup,
//     updateGroup,
//     createGroup,
//     // getGroupState,
//   };
// };
