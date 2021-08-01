import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.put(filename, file, {
    level: 'protected',
    contentType: file.type,
  });

  return stored.key;
}
