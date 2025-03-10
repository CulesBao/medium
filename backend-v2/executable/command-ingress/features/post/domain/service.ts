import client from '../../../../../cdc/redisConnection';
import Post from '../../../../../internal/model/post';
import User from '../../../../../internal/model/user';
import { PostEntity, PostCreationDto, PostService } from '../types';

export class PostServiceImpl implements PostService {
  async deletePost(id: string): Promise<void> {
    await Post.findOneAndDelete({ _id: id });
  }
  async editPost(id: string, editPostDto: PostCreationDto): Promise<PostEntity> {
    const codeRegex = /<code>(.*?)<\/code>/g;
    const withoutCode = editPostDto.markdown.replace(codeRegex, '');
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    const summary = withoutCode.replace(htmlRegexG, '');

    const editResult = await Post.findOneAndUpdate({
      _id: id
    }, {
      title: editPostDto.title,
      markdown: editPostDto.markdown,
      image: editPostDto.image,
      tags: editPostDto.tags,
      summary: summary,
    }, {
      new: true
    })

    return {
      id: String(editResult._id),
      image: String(editResult.image),
      authorID: String(editResult.author),
      markdown: editResult.markdown,
      title: editResult.title,
      tags: editResult.tags,
      summary: editResult.summary,
      createdAt: Number(editResult.createdAt),
    }
  }
  async getPost(id: string): Promise<PostEntity> {
    const post = await Post.findOne({ _id: id });

    if (!post) {
      throw new Error('Post not found');
    }

    const user = await User.findOne({ _id: post.author });

    return {
      id: String(post._id),
      image: String(post.image),
      authorID: String(post.author),
      markdown: post.markdown,
      title: post.title,
      tags: post.tags,
      summary: post.summary,
      createdAt: Number(post.createdAt),
      author: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }
  async fetchPostsByUser(id: string): Promise<PostEntity[]> {
    let posts = await client.zRange(`user:${id}:following-feeds`, 0, -1)
    const feeds = posts.map((post: string) => JSON.parse(post))
    if (!posts)
      throw new Error('No feeds')
    return feeds as PostEntity[]
  }

  async createPost(postCreationDto: PostCreationDto): Promise<PostEntity> {
    const codeRegex = /<code>(.*?)<\/code>/g;
    const withoutCode = postCreationDto.markdown.replace(codeRegex, '');
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    const summary = withoutCode.replace(htmlRegexG, '');

    const insertResult = await Post.create({
      author: postCreationDto.authorID,
      title: postCreationDto.title,
      markdown: postCreationDto.markdown,
      image: postCreationDto.image,
      tags: postCreationDto.tags,
      summary: summary,
    });

    return {
      id: String(insertResult._id),
      image: String(insertResult.image),
      authorID: String(insertResult.author),
      markdown: insertResult.markdown,
      title: insertResult.title,
      tags: insertResult.tags,
      summary: insertResult.summary,
      createdAt: Number(insertResult.createdAt),
    }
  }


}