import { ActionPanel, Detail, List, Action, open } from "@raycast/api";
import fs from "fs";
import os from "os";
import path from "path";

export default function Command() {
  const documentsPath = path.join(os.homedir(), "Library/Containers/co.fluder.FSNotes/Data/Documents");
  const mdFiles = fs
    .readdirSync(documentsPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      name: file,
      modified: fs.statSync(path.join(documentsPath, file)).mtimeMs,
    }))
    .sort((a, b) => b.modified - a.modified)
    .map((file) => file.name);

  return (
    <List>
      {mdFiles.map((file) => (
        <List.Item
          key={file}
          icon="fsnotes-list.png"
          title={file}
          actions={
            <ActionPanel>
              <Action.Push
                title="Show Details"
                target={<Detail markdown={fs.readFileSync(path.join(documentsPath, file), "utf-8")} />}
              />
              <Action.Open
                title="Open in FSNotes"
                target={`fsnotes://find/${encodeURIComponent(file.replace(/\.md$/, ""))}`}
              />
              <Action.OpenWith title="Open With" path={path.join(documentsPath, file)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
