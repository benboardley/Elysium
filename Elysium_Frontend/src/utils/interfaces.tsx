export interface Post {
    id: string;
    profile: string;
    creation_time: string;
    update_time: string;
    title?: string;
    caption?: string;
    parent_post: string;
    song?: object;
    playlist?: object;
    album?: object;
    likes: number;
}
