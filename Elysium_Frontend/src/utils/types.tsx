export type Navigation = {
  navigate: (scene: string, params?: object) => void;
};

export type Route<T = {}> = {
  key: string;
  name: string;
  params: T;
};

export type songType = {
  id: string;
  name: string;
  artist: string;
  artist_features: Array<string>;
  origin: string;
  uri: string;
  //audio_features: object;
  //other_available_platforms: Array<string>;
  //song_clip_location: string;
  song_thumbnail_location: string;
  album: null;
};
