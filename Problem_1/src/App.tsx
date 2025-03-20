import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';
import { UsersProvider, useUsers } from './contexts/UsersContext';
import { PostsProvider, usePosts } from './contexts/PostsContext';
import { useEffect } from 'react';
import { getUsers, getAllPosts } from './services/api';
import { User, Post } from './types/types';

function AppContent() {
  const { setUsers } = useUsers();
  const { setPosts, setPostCounts, setCommentCounts } = usePosts();

  // Inside src/App.tsx, within the useEffect hook
// Inside src/App.tsx, within the useEffect hook
useEffect(() => {
  const fetchData = async () => {
      try {
          const usersData = await getUsers(); // Calls the getUsers function from api.ts
          // ... process usersData ...

          const allPosts = await getAllPosts(usersData); // Calls getAllPosts, which uses getPostsForUser
          // ... process allPosts ...

      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  fetchData();
}, [setUsers, setPosts, setPostCounts, setCommentCounts]);
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="mb-6">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link to="/" className="text-lg font-semibold hover:underline">Top Users</Link>
            </li>
            <li>
              <Link to="/trending" className="text-lg font-semibold hover:underline">Trending Posts</Link>
            </li>
            <li>
              <Link to="/feed" className="text-lg font-semibold hover:underline">Feed</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<TopUsers />} />
          <Route path="/trending" element={<TrendingPosts />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <UsersProvider>
      <PostsProvider>
        <AppContent />
      </PostsProvider>
    </UsersProvider>
  );
}

export default App;