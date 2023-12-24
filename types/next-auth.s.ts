import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    /** The user's id number */
    id: number;
    /** The user's name */
    name: string;
    /** The user's email address */
    email: string;
    /** The user's profile image url (provided by oAuth service) */
    avatar: string;
  }
}
