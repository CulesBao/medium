import { ObjectId } from 'mongodb';
export type UsersSearch = {
    id: string;
    name: string;
    avatar: string;
    followers: ObjectId[];
    bio: string;
}
export type PostsSearch = {
    id: string;
    title: string;
    summary: string;
    createdAt: number;
    image: string;
    tags: string[];
    user: UsersSearch
}
export interface SearchService {
    postSearch(query: string): Promise<PostsSearch[]>;
    topicSearch(query: string): Promise<void>;
    userSearch(query: string): Promise<UsersSearch[]>;
}