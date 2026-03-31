"use client";
import { useState } from "react";

type FlatFile = { path: string; content: string };

const DIRECTORY: FlatFile[] = [
  { path: "app/folder/index.html", content: "Folder Page" },
  { path: "app/folder/second.html", content: "Second Folder Page" },
  { path: "app/index.html", content: "Hello World" },
];

type Directory = {
  path: string;
  content: string | Directory[];
};

function buildStructure(files: FlatFile[]): Directory[] {
  const root: Directory[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (isFile) {
        current.push({ path: part, content: file.content });
      } else {
        let dir = current.find((d) => d.path === part);
        if (!dir) {
          dir = { path: part, content: [] };
          current.push(dir);
        }
        current = dir.content as Directory[];
      }
    }
  }

  return root;
}

const FileSet = ({
  path,
  content,
  onOpen,
}: {
  path: string;
  content: string | Directory[];
  onOpen: (content: string) => void;
}) => (
  <li className="pl-4 bg-[#cccccc22]">
    {Array.isArray(content) ? path : null}
    <ul>
      {Array.isArray(content) ? (
        content.map((i) => <FileSet key={i.path} {...i} onOpen={onOpen} />)
      ) : (
        <button onClick={() => onOpen(content)}>{path}</button>
      )}
    </ul>
  </li>
);

const structured = buildStructure(DIRECTORY);

function Explorer() {
  const [fileContent, setFileContent] = useState<string | undefined>();
  const handleOpen = (content: string) => {
    setFileContent(content);
  };
  return (
    <div className="flex">
      <ul className="p-6 w-33%">
        {structured.map((dir) => (
          <FileSet
            key={dir.path}
            path={dir.path}
            content={dir.content}
            onOpen={handleOpen}
          />
        ))}
      </ul>
      {fileContent}
    </div>
  );
}
export default Explorer;
