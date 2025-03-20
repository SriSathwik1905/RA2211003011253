import { usePosts } from '../contexts/PostsContext';
import { Post } from '../types/types';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { createMockSSEServer } from '../services/api';


function Feed() {
    const { posts, setPosts, setCommentCounts } = usePosts();
    const [error, setError] = useState<string | null>(null);
    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => b.id - a.id);
    }, [posts]);

    const addNewPost = useCallback((newPost: Post) => {
        setPosts((prevPosts) => {
            // Check if the post already exists (shouldn't happen with our simulation, but good practice)
            if (prevPosts.some((post) => post.id === newPost.id)) {
                return prevPosts;
            }
            return [...prevPosts, newPost]; // Add the new post to the existing posts
        });
        setCommentCounts((prevCommentCounts) => {
            const newCommentCounts = new Map(prevCommentCounts);
            newCommentCounts.set(newPost.id, 0);
            return newCommentCounts;
        });
    }, [setPosts, setCommentCounts]);

    useEffect(() => {
        const closeSSEConnection = createMockSSEServer(addNewPost);

        return () => {
            closeSSEConnection(); // Clean up the connection when the component unmounts
        };
    }, [addNewPost]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Feed</h1>
            {sortedPosts.length > 0 ? (
                <ul>
                    {sortedPosts.map((post) => (
                        <li key={post.id} className="mb-4 p-4 border rounded-md">
                            <p className="font-semibold">Post ID: {post.id}</p>
                            <p>User ID: {post.userid}</p>
                            <p>Content: {post.content}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts to display.</p>
            )}
        </div>
    );
}

export default Feed;