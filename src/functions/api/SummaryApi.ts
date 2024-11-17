import {Folder, Summary} from "../../domain";
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

  const summaryUrl = (folder?: Folder): string =>
  {
    return Api.url() + "/v1/summary" + (folder ? "?folderId=" + folder.id : "");
  }

  const summaryAudioUrl = (summaryId: number): string =>
  {
    return Api.url() + "/v1/summary/" + summaryId + "/audio";
  }

  const summary = (summaryDto: SummaryDto): Summary =>
  {
    return new Folder(summaryDto.id, summaryDto.name);
  }

  const newSummary = async (accessToken: string, file: File, folder?: Folder): Promise<Summary> =>
  {
    const requestOptions =
    {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + accessToken },
      body: JSON.stringify({ "folderId": folder?.id, "name": file.name })
    };

    return fetch(summaryUrl(), requestOptions)
      .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
      .then(body => summary(body));
  }

  const updateSummaryAudio = async (accessToken: string, file: File, summary: Summary): Promise<Summary> =>
  {
    const formData = new FormData();
    formData.append("file", file);

    const requestOptions =
      {
        method: "PUT",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        body: formData
      };

    return fetch(summaryAudioUrl(summary.id!), requestOptions)
      .then(response => response.ok ? summary : Promise.reject(response.statusText));
  }

  return new class implements SummaryApi
  {
    async all(folder?: Folder): Promise<Summary[]>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const requestOptions =
      {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + accessToken }
      };

      return fetch(summaryUrl(folder), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => body.map(summary));
    }

    async newSummary(file: File, folder?: Folder): Promise<Summary>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      return newSummary(accessToken, file, folder).then(summary => updateSummaryAudio(accessToken, file, summary));
    }
  }
}