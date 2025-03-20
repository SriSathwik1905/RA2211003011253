import { User, Post, Comment } from '../types/types';

const BASE_URL = 'http://20.244.56.144/test';

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${BASE_URL}/users`); // Fetches from the users API
  const data = await response.json();
  return data.users;
};

export const getPostsForUser = async (userId: number): Promise<Post[]> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/posts`); // Fetches posts for a user
  const data = await response.json();
    if (data && data.posts) {
        return data.posts;
    }
    return [];
};

export const getCommentsForPost = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`); // Fetches comments for a post
  const data = await response.json();
    if(data && data.comments){
        return data.comments;
    }
    return [];
};

// Helper function to fetch all posts
export const getAllPosts = async (users: User[]): Promise<Post[]> => {
    const allPosts: Post[] = [];
    for (const user of users) {
        const posts = await getPostsForUser(user.id);
        allPosts.push(...posts);
    }
    return allPosts;
};

// --- SSE Simulation ---

// This function simulates a server sending new posts at intervals.
export const createMockSSEServer = (callback: (newPost: Post) => void) => {
    let nextPostId = 1000; // Start with a high ID to avoid conflicts

    const intervalId = setInterval(() => {
        // Simulate a new post
        const newPost: Post = {
            id: nextPostId++,
            userid: Math.floor(Math.random() * 10) + 1, // Random user ID between 1 and 10
            content: `Simulated Post ${nextPostId}`,
        };

        // Call the callback function with the new post
        callback(newPost);
    }, 5000); // Send a new post every 5 seconds (adjust as needed)

    // Return a function to close the connection
    return () => {
        clearInterval(intervalId);
    };
};