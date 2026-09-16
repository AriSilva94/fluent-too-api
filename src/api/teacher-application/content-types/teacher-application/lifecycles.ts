import { APPLICATION_STATUS, promoteApprovedCandidate } from '../../services/review';

export function needsReviewedAt(data: Record<string, any> | undefined): boolean {
  if (!data) return false;
  const decided = data.reviewStatus === APPLICATION_STATUS.approved || data.reviewStatus === APPLICATION_STATUS.rejected;
  return decided && !data.reviewedAt;
}

export default {
  beforeUpdate(event: any) {
    if (needsReviewedAt(event.params?.data)) {
      event.params.data.reviewedAt = new Date();
    }
  },

  async afterUpdate(event: any) {
    const id = event.result?.id;
    if (!id || event.result?.reviewStatus !== APPLICATION_STATUS.approved) return;

    await promoteApprovedCandidate(strapi, id);
  },
};
