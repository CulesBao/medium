import { PostEntity } from '../../post/types';
import { UserEntity } from '../../user/types';
import { SearchService } from '../types';
import UserModel from '../../../../../internal/model/user';

export class SearchServiceImpl implements SearchService {
    postSearch(query: string): Promise<PostEntity[]> {
        throw new Error('Method not implemented.');
    }
    topicSearch(query: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async userSearch(query: string): Promise<UserEntity[]> {
        const users = await UserModel.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } },
            ]
        })
        return users.map(user => {
            return {
                id: String(user._id),
                email: user.email,
                name: user.name,
                avatar: user.avatar
            }
        })
    }
}