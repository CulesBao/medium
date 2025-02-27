import { PostEntity } from '../post/types';
import { UserEntity } from '../user/types';
export interface SearchService{
    postSearch(query: string): Promise<PostEntity[]>;
    topicSearch(query: string): Promise<void>;
    userSearch(query: string): Promise<UserEntity[]>;
}