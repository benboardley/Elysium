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
  artist_features?: Array<string>;
  origin?: string;
  uri?: string;
  audio_features?: object;
  other_available_platforms?: Array<string>|null;
  song_clip_location?: string|null;
  song_thumbnail_location: string;
};

export type stripSongType = {
  pk: number;
  name: string;
  artist: string;
  uri?: string;
  song_thumbnail_location: string;
};

export type albumType = {
  name: string;
  uri: string;
  artist: string;
  artist_features?: Array<string>;
  songs: Array<stripSongType>;
  album_thumbnail_location: string;
}

export type playlistType = {
  name: string;
  uri: string;
  description: string;
  songs: Array<stripSongType>;
  playlist_thumbnail_location: string;
}
