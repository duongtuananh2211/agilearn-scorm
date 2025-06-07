export declare type WithId<T> = T & {
  id: string;
};

export declare type Scorm = {
  id: string;
  originalName: string;
  indexFilePath: string;
  createdAt: Date;
  path: string;
  resourcePaths: string[];
};
