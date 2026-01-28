import { sendRequest } from "@/utils/sendRequest";

export async function getAllResources<T>(resourceType: string): Promise<T[]> {
  const response = await sendRequest(`${resourceType}/`, "GET");
  return response as T[];
}

export async function createResource<T>(
  resourceType: string,
  resourceData: T
): Promise<T> {
  const response = await sendRequest(`${resourceType}/`, "POST", resourceData);
  return response as T;
}

export async function updateResource<T>(
  resourceType: string,
  // resourceId: number,
  resourceData: T
): Promise<T> {
  const response = await sendRequest(`${resourceType}`, "PUT", resourceData);
  return response as T;
}

export async function deleteResource(
  resourceType: string,
  resourceId: number
): Promise<void> {
  await sendRequest(`${resourceType}/${resourceId}`, "DELETE");
}
