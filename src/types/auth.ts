export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
}
