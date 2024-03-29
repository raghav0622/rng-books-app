import { useFYDB } from '@/db';
import { cleanUndefined } from '@rng-apps/forms';
import { useFYDBState, useFYMetaState, useFYState } from '../1-atoms';

export const useFYActions = () => {
  const { updateFYMetaState } = useFYMetaState();
  const { fyDB } = useFYDBState();
  const fy = useFYState();
  const { updateFY } = useFYDB();

  const canSaveFY = fyDB && fy.version !== fyDB.version;

  const saveFYChanges = async () => {
    if (canSaveFY) {
      const update = await cleanUndefined(fy);

      await updateFY(fy.id, update);
    }
    return;
  };

  const fyAction = () => {
    updateFYMetaState((prev) => ({
      ...prev,
      version: prev.version + 1,
    }));
  };

  return { canSaveFY, saveFYChanges, fyAction };
};
