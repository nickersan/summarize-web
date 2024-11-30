import {Summary} from "../../domain";
import {Api} from "../../Api";

export interface SummaryApi
{
  getAll(folderId?: number | undefined): Promise<Summary[]>;
  create(file: File, folderId?: number | undefined): Promise<Summary>;
  update(summary: Summary): Promise<Summary>;
}

export const summaryApi = (accessTokenSupplier: () => string | undefined): SummaryApi =>
{
  interface SummaryDto
  {
    id: number,
    folderId: number | undefined,
    name: string
  }

  const summaryUrl = (folderId?: number): string =>
  {
    return Api.url() + "/v1/summary" + (folderId ? "?folderId=" + folderId : "");
  }

  const summaryIdUrl = (summaryId: number): string =>
  {
    return Api.url() + "/v1/summary/" + summaryId;
  }

  const summaryAudioUrl = (summaryId: number): string =>
  {
    return summaryIdUrl(summaryId) + "/audio";
  }

  const parseSummary = (summaryDto: SummaryDto): Summary =>
  {
    return new Summary(summaryDto.id, summaryDto.folderId, summaryDto.name);
  }

  const newSummary = async (accessToken: string, file: File, folderId?: number): Promise<Summary> =>
  {
    const requestOptions =
    {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + accessToken },
      body: JSON.stringify({ "folderId": folderId, "name": file.name })
    };

    return fetch(summaryUrl(), requestOptions)
      .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
      .then(body => parseSummary(body));
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
    async getAll(folderId?: number): Promise<Summary[]>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const requestOptions =
      {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + accessToken }
      };

      return fetch(summaryUrl(folderId), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => body.map(parseSummary));
    }

    async create(file: File, folderId?: number): Promise<Summary>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      return newSummary(accessToken, file, folderId).then(summary => updateSummaryAudio(accessToken, file, summary));
    }

    async update(summary: Summary): Promise<Summary>
    {
      const accessToken = accessTokenSupplier();
      if (!accessToken) return Promise.reject("Access token missing, cannot invoke folder API.");

      const requestOptions =
        {
          method: "PUT",
          headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + accessToken },
          body: JSON.stringify(summary)
        };

      return fetch(summaryIdUrl(summary.id!), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(body => parseSummary(body));
    }
  }
}