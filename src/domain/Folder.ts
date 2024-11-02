export class Folder
{
  id: number | undefined;
  // parentId: number | undefined;
  name: string;

  constructor(id: number, name: string)
  {
    this.id = id;
    this.name = name;
  }
}