import {AuthClient, GoogleAuth, Impersonated} from 'google-auth-library';
import { Headers } from 'google-auth-library/build/src/auth/oauth2client';

async function getImpersonatedClient(sourceClient: AuthClient, targetPrincipal: string, targetScopes: string[]): Promise<Impersonated> {
  return new Impersonated({
    sourceClient,
    targetPrincipal,
    targetScopes
  });
}

export async function getAuthHeader(projectId: string, serviceAccount: string, scopes: string[]): Promise<Headers> {
  const auth = new GoogleAuth({projectId});
  const authClient = await auth.getClient();
  const impersonatedClient = await getImpersonatedClient(authClient, serviceAccount, scopes);
  return impersonatedClient.getRequestHeaders();
}
