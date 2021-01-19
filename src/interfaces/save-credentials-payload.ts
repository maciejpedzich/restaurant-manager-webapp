import User from '@/interfaces/user';

export default interface SaveCredentialsPayload {
  accessToken: string;
  currentUser: User;
}
