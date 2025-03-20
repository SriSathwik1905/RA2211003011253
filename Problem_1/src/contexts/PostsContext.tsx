import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Post } from '../types/types.ts';  // We'll define this type later

interface PostsContextProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  postCounts: Map<number, number>;
  setPostCounts: React.Dispatch<React.SetStateAction<Map<number, number>>>;
  commentCounts: Map<number, number>;
  setCommentCounts: React.Dispatch<React.SetStateAction<Map<number, number>>>;
}

const PostsContext = createContext<PostsContextProps | undefined>(undefined);

export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postCounts, setPostCounts] = useState<Map<number, number>>(new Map());
  const [commentCounts, setCommentCounts] = useState<Map<number, number>>(new Map());
  return (
    <PostsContext.Provider value={{ posts, setPosts, postCounts, setPostCounts, commentCounts, setCommentCounts }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};