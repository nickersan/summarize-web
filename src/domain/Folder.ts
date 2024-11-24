export class Folder
{
  id: number | undefined;
  parentId: number | undefined;
  name: string;

  constructor(id: number, parentId: number | undefined, name: string)
  {
    this.id = id;
    this.parentId = parentId;
    this.name = name;
  }
}