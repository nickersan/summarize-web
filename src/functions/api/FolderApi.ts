import {Folder} from "../../domain";
import {Api} from "../../Api";

export interface FolderApi
{
  all(parentFolder?: Folder): Promise<Folder[]>;
  newFolder(name: string, parentFolder?: Folder): Promise<Folder>;
}

export const folderApi = (accessTokenSupplier: () => string | undefined): FolderApi =>
{
  interface FolderDto
  {
    id: number,
    name: string
  }

  const url = (parentFolder?: Folder): string =>
  {
    return Api.url() + "/v1/folder" + (parentFolder ? "/" + parentFolder.id : "");
  }

  const folder = (folderDto: FolderDto): Folder =>
  {
    return new Folder(folderDto.id, folderDto.name);
  }

  return new class implements FolderApi
  {
    async all(parentFolder?: Folder): Promise<Folder[]>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const requestOptions =
      {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + accessToken }
      };

      return fetch(url(parentFolder), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => body.map(folder));
    }

    async newFolder(name: string, parentFolder?: Folder): Promise<Folder>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const requestOptions =
      {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + accessToken },
        body: JSON.stringify({ "parentId": parentFolder?.id, "name": name })
      };

      return fetch(url(), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => folder(body));
    }
  }
}
