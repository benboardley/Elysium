export type Navigation = {
  navigate: (scene: string, params?: object) => void;
};

export type Route<T = {}> = {
  key: string;
  name: string;
  params: T;
};