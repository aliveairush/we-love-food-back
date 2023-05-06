import PostModel from "../../resources/post/post.model.js";
import Post from "../../resources/post/post.interface.js";

class PostService {
    private post = PostModel;

    /** Create new post */
    public async createPost({
        title,
        body
    }: {
        title: string;
        body: string;
    }): Promise<Post> {
        try {
            const post = await this.post.create({ title, body });

            return post;
        } catch (error) {
            throw new Error("Unable to create Post");
        }
    }
}

export default PostService;
