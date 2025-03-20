import { usePosts } from '../contexts/PostsContext';
import { getCommentsForPost } from '../services/api';
import { Post, Comment } from '../types/types'; // Import Comment
import { useState, useEffect, useCallback } from 'react';

function TrendingPosts() {
    const { posts, commentCounts, setCommentCounts } = usePosts();
    const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch comments for a specific post and update commentCounts
    const fetchCommentsAndUpdateCount = useCallback(async (postId: number) => {
        try {
            const comments = await getCommentsForPost(postId);
            setCommentCounts((prevCommentCounts) => {
                const newCommentCounts = new Map(prevCommentCounts);
                newCommentCounts.set(postId, comments.length);
                return newCommentCounts;
            });
        } catch (err) {
            setError('Failed to fetch comments'); // Set error state
            console.error("Error fetching comments:", err);
        }
    }, [setCommentCounts]);


    useEffect(() => {
        const findTrendingPosts = async () => {
            setLoading(true);
            setError(null); // Clear any previous errors
            try {
                // 1. Find the maximum comment count (initially, this will be 0)
                const maxComments = Math.max(...commentCounts.values());

                // 2. Find posts that have this maximum comment count
                const potentialTrendingPostIds: number[] = [];
                commentCounts.forEach((count, postId) => {
                    if (count === maxComments) {
                        potentialTrendingPostIds.push(postId);
                    }
                });

                // 3. Fetch comments for potential trending posts (if maxComments is 0)

                if(maxComments === 0){
                    for (const postId of potentialTrendingPostIds) {
                        await fetchCommentsAndUpdateCount(postId);
                    }
                }

                //4.- Filter and set the trending posts
                const updatedMaxComments = Math.max(...commentCounts.values()); //Find the max number of comments
                const finalTrendingPosts = posts.filter(post => commentCounts.get(post.id) === updatedMaxComments); //Filter the posts
                setTrendingPosts(finalTrendingPosts);

            } catch (err) {
                setError('Failed to find trending posts');
                console.error("Error finding trending posts:", err);
            } finally {
                setLoading(false);
            }
        };
        findTrendingPosts();

    }, [posts, commentCounts, setCommentCounts, fetchCommentsAndUpdateCount]);


    if (loading) {
        return <div>Loading trending posts...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
            {trendingPosts.length > 0 ? (
                <ul>
                    {trendingPosts.map((post) => (
                        <li key={post.id} className="mb-2">
                            <span className="font-semibold">Post ID: {post.id}</span> -
                            Content: {post.content} -
                            Comments: {commentCounts.get(post.id) || 0}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No trending posts found.</p>
            )}
        </div>
    );
}

export default TrendingPosts;