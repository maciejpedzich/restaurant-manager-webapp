import User from '@/interfaces/user';

export default interface AuthModuleState {
  accessToken: string | null;
  currentUser: User | null;
  nextRefreshTimestamp: number | null;
  silentRefreshTimeout: number | null;
}
