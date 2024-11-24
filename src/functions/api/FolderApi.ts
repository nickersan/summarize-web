import {Folder} from "../../domain";
import {Api} from "../../Api";

export interface FolderApi
{
  get(folderId: number): Promise<Folder>;
  getAll(parentFolderId?: number): Promise<Folder[]>;
  create(name: string, parentFolderId?: number): Promise<Folder>;
  update(folder: Folder): Promise<Folder>;
}

export const folderApi = (accessTokenSupplier: () => string | undefined): FolderApi =>
{
  interface FolderDto
  {
    id: number,
    parentId: number | undefined,
    name: string
  }

  const url = (folderId?: number): string =>
  {
    return Api.url() + "/v1/folder" + (folderId ? "/" + folderId : "");
  }

  const parseFolder = (folderDto: FolderDto): Folder =>
  {
    return new Folder(folderDto.id, folderDto.parentId, folderDto.name);
  }

  return new class implements FolderApi
  {
    async get(folderId: number): Promise<Folder>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const requestOptions =
        {
          method: "GET",
          headers: { "Accept": "application/json", "Authorization": "Bearer " + accessToken }
        };

      return fetch(url(folderId), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => parseFolder(body));
    }

    async getAll(parentFolderId?: number): Promise<Folder[]>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const requestOptions =
      {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + accessToken }
      };

      return fetch(url() + (parentFolderId ? "?parentFolderId=" + parentFolderId : ""), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => body.map(parseFolder));
    }

    async create(name: string, parentFolderId?: number): Promise<Folder>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const requestOptions =
      {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + accessToken },
        body: JSON.stringify({ "parentId": parentFolderId, "name": name })
      };

      return fetch(url(), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => parseFolder(body));
    }

    async update(folder: Folder): Promise<Folder>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const requestOptions =
        {
          method: "PUT",
          headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + accessToken },
          body: JSON.stringify(folder)
        };

      return fetch(url(folder.id), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => parseFolder(body));
    }
  }
}
