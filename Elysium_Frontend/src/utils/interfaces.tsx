import { albumType, playlistType, songType } from '../utils/types'

export interface RouteParams {
    userInfo: User;
  }

export interface User {
    id: number;
    user: number;
    username: string;
    followers: number[];
    following: number[];
    posts: number[];
    creation_time: string;
    bio?: string;
    location?: string;
    update_time?: string;
}

export interface StripUser {
    id: number;
    username: string;
}

export interface StripSong {
    name: string;
    artist: string;
    uri: string;
    song_thumbnail_location: string;
}

export interface StripPost {
    title: string;
    caption: string;
    song_uri?: string;
    album_uri?: string;
    playlist_uri?: string;
}

export interface Post {
    id: string;
    profile: string;
    profile_username: string;
    creation_time: string;
    update_time: string;
    title: string;
    caption: string;
    parent_post?: string;
    likes: Array<number>;
    song_post?: songType;
    playlist_post?: playlistType;
    album_post?: albumType;
}

export interface Follower {
    id: string;
    username: string;
    email: string;
}
