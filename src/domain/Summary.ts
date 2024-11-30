export class Summary
{
  id: number | undefined;
  folderId: number | undefined;
  name: string;

  constructor(id: number, folderId: number | undefined, name: string)
  {
    this.id = id;
    this.folderId = folderId;
    this.name = name;
  }
}