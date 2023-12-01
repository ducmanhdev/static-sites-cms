import CredentialsProvider from 'next-auth/providers/credentials';
import { NuxtAuthHandler } from '#auth';

const runtimeConfig = useRuntimeConfig();
export default NuxtAuthHandler({
  secret: runtimeConfig.authSecret,
  pages: {
    signIn: '/login',
  },
  providers: [
    // @ts-ignore
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {},
      async authorize(credentials: { attribute: string; password: string }) {
        const res: any = await $fetch('/api/v1/web_portal/user/form/login', {
          baseURL: runtimeConfig.public.backendURL as string,
          method: 'POST',
          body: {
            attribute: credentials.attribute,
            password: credentials.password,
          },
        });
        const user = res?.data?.user;
        if (!user) {
          throw new Error('Invalid username or password');
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        ...token,
      };
      return session;
    },
  },
});
