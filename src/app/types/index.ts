export interface FSNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FSNode[];
}
