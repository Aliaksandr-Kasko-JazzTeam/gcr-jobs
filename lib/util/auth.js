const {GoogleAuth, Impersonated} = require('google-auth-library');

const getImpersonatedClient = async (sourceClient, targetPrincipal, targetScopes) => new Impersonated({
  sourceClient,
  targetPrincipal,
  targetScopes
});

export async function getAuthHeader(projectId, serviceAccount, scopes) {
  const auth = new GoogleAuth({projectId});
  const authClient = await auth.getClient();
  const impersonatedClient = await getImpersonatedClient(authClient, serviceAccount, scopes);
  return impersonatedClient.getRequestHeaders();
}
