import { songType } from '../utils/types'

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
