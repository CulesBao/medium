import { PostEntity } from '../../post/types';
import { PostsSearch, UsersSearch } from '../types';
import { SearchService } from '../types';
import UserModel from '../../../../../internal/model/user';
import PostModel from '../../../../../internal/model/post';

export class SearchServiceImpl implements SearchService {
    async postSearch(query: string): Promise<PostsSearch[]> {
        const posts = await PostModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ]
        }).populate({
            path: 'author',
            select: '_id name avatar followers bio'
        })
        .exec()
        if (!posts)
            throw new Error('No posts found')
        return posts.map((post: any) => {
            return {
                id: String(post._id),
                title: post.title,
                summary: post.summary,
                createdAt: post.createdAt,
                image: post.image,
                tags: post.tags,
                user: {
                    id: String(post.author._id),
                    name: post.author.name,
                    avatar: post.author.avatar,
                    followers: post.author.followers,
                    bio: post.author.bio,
                }
            }
        })
    }
    topicSearch(query: string): Promise < void> {
            throw new Error('Method not implemented.');
        }
    async userSearch(query: string): Promise < UsersSearch[] > {
            const users = await UserModel.find({
                $or: [
                    { username: { $regex: query, $options: 'i' } },
                    { name: { $regex: query, $options: 'i' } },
                ]
            })
        return users.map(user => ({
                id: String(user._id),
                name: user.name,
                avatar: user.avatar,
                followers: user.followers,
                bio: user.bio,
            }))
        }
}