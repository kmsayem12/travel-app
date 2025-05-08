export type PublicStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export type PrivateStackParamList = {
  Home: undefined;
  ChatList: undefined;
  Chat: {userId: string; userName: string};
};

export type RootStackParamList = PublicStackParamList & PrivateStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
