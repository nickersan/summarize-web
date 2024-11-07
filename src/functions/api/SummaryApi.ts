import {Folder} from "../../domain";
import {Summary} from "../../domain/Summary";
import {Api} from "../../Api";

export interface SummaryApi
{
  all(folder?: Folder): Promise<Summary[]>;
  newSummary(file: File, folder?: Folder): Promise<Summary>;
}

export const summaryApi = (accessTokenSupplier: () => string | undefined): SummaryApi =>
{
  interface SummaryDto
  {
    id: number,
    name: string
  }

  const url = (folder?: Folder): string =>
  {
    return Api.url() + "/v1/summary" + (folder ? "?folderId=" + folder.id : "");
  }

  const summary = (summaryDto: SummaryDto): Summary =>
  {
    return new Folder(summaryDto.id, summaryDto.name);
  }

  return new class implements SummaryApi
  {
    async all(folder?: Folder): Promise<Summary[]>
    {
      return Promise.reject("Not yet implemented");
    }

    async newSummary(file: File, folder?: Folder): Promise<Summary>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const formData = new FormData();
      formData.append("file", file);

      const requestOptions =
        {
          method: "POST",
          headers: { "Accept": "application/json", "Authorization": "Bearer " + accessToken },
          body: formData
        };

      return fetch(url(folder), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => summary(body));
    }
  }
}