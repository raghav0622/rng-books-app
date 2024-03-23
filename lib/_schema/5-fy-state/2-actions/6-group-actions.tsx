import { notifications } from '@mantine/notifications';
import { cleanUndefined } from '@rng-apps/forms';
import { v4 } from 'uuid';
import { CreateGroup, Group } from '../../1-schema';
import { useGroupState } from '../1-atoms';
import { useFYActions } from './2-fy-actions';

export const useGroupActions = () => {
  const {
    addGroupState,
    // deleteGroupState,
    // updateGroupState,
    // groups,
  } = useGroupState();

  const { fyAction } = useFYActions();
  // const { updateBookState } = useBookState();

  const createGroup = async (payload: CreateGroup) => {
    const group: Group = {
      balance: 0,
      editable: true,
      id: v4(),
      groupLevel: payload.parentGroup.groupLevel + 1,
      type: payload.parentGroup.type,
      recordType: 'Group',
      exploded: payload.exploded,
      balanceCRLabel: payload.balanceCRLabel,
      balanceDRLabel: payload.balanceDRLabel,
      parentGroup: payload.parentGroup.id,
      name: payload.name,
      description: payload.description,
      childCount: 0,
      childGroupsPossible: payload.childGroupsPossible,
      category: payload.parentGroup.category,
      parentGroupName: payload.parentGroup.name,
    };
    const cleanedGroup = await cleanUndefined(group);

    addGroupState(cleanedGroup);

    notifications.show({
      color: 'green',
      title: 'Success!',
      message: 'Group: ' + payload.name + ', Successfully created!',
    });

    fyAction();

    return group;
  };

  return {
    createGroup,
    // getGroupState,
  };
};
