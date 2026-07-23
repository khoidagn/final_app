export const authChannel = new BroadcastChannel('auth_action_channel');

export type AuthChannelMessage = {
  type: 'VERIFY_SUCCESS' | 'RESET_PASSWORD_SUCCESS';
  message?: string;
};