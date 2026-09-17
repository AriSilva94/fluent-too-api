export default {
  beforeCreate(event: any) {
    applyResetTokenExpiry(event);
  },
  beforeUpdate(event: any) {
    applyResetTokenExpiry(event);
  },
};

function applyResetTokenExpiry(event: any) {
  const data = event.params?.data;
  if (!data || !Object.prototype.hasOwnProperty.call(data, 'resetPasswordToken')) return;
  data.resetPasswordTokenExpiresAt = data.resetPasswordToken ? new Date(Date.now() + 60 * 60 * 1000).toISOString() : null;
}
