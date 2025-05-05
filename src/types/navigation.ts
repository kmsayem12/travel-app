export type PublicStackParamList = {
  Splash: undefined;
  Login: undefined;
};

export type PrivateStackParamList = {
  Home: undefined;
};

export type RootStackParamList = PublicStackParamList & PrivateStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
