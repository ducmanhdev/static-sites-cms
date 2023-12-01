export const trueTypeOf = (obj: any) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

export const slugToTitle = (slug: string) => {
  const string = slug
    .replace(/_/g, ' ')
    .replace(/\[\*\]/g, ' ')
    .trim();
  return string[0].toUpperCase() + string.slice(1);
};

export const objectToFormData = (obj: Record<any, any>) => {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
      return;
    }
    formData.append(key, value);
  });
  return formData;
};

export const stringToFile = (content: string, fileName = 'data.txt', fileType = 'text/plain') => {
  return new File([content], fileName, {
    type: fileType,
  });
};

export const isFileImage = (filename: string) => /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filename);

export const tryParseJson = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export const isValidImageExt = (str: string) => /\.(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg|webp)$/.test(str);

export const isRelativePath = (path: string) => {
  if (!path) return false;
  return !/^https?:\/\//.test(path);
};

export const validateSchemaFile = (name: string) => {
  if (!name) return 'You must enter an file name';
  if (!/^(\/)?([A-z0-9-_+]+\/)*([A-z0-9]+\.([A-z0-9])+$)/.test(name)) return 'Your path file is invalid';
  return null;
};

export const validateSchemaFolder = (name: string) => {
  if (!name) return 'You must enter an folder name';
  if (!/^(\w+\.?)*\w+$/.test(name))
    return 'Your folder name must only contain letters, numbers, dots, dashes or underscores.';
  return null;
};
