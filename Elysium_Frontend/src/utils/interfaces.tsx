import { songType } from '../utils/types'

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    followers: string[];
    following: string[];
    posts: string[];
    playlists: string[];
    albums: string[];
    songs: string[];
}

export interface Post {
    id: string;
    profile: string;
    profile_username: string;
    creation_time: string;
    update_time: string;
    title?: string;
    caption?: string;
    parent_post: string;
    song?: object;
    playlist?: object;
    album?: object;
    likes: number;
    song_post?: songType;
}

export interface Follower {
    id: string;
    username: string;
    email: string;
}
