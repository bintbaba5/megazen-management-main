export async function getUserToken() {
  const response = await fetch("/api/auth/cookies");
  const data = await response.json();
  return data.userToken;
}
