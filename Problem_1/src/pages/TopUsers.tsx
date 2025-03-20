import { useUsers } from '../contexts/UsersContext';
import { usePosts } from '../contexts/PostsContext';
import { User } from '../types/types';
import { useMemo } from 'react';

function TopUsers() {
  const { users } = useUsers();
  const { postCounts } = usePosts();

  const sortedUserIds = useMemo(() => {
    return Array.from(postCounts.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([userId]) => userId);
  }, [postCounts]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Top Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedUserIds.slice(0, 5).map((userId, index) => { // Add index for ranking
          const user = users.get(userId);
          const postCount = postCounts.get(userId) || 0;
          return (
            <div key={userId} className="border rounded-lg p-4 shadow-md">
              {user ? (
                <>
                  <img
                    src={`https://source.unsplash.com/random/50x50?sig=${userId}`} // Random image per user
                    alt={`Avatar for ${user.name}`}
                    className="w-12 h-12 rounded-full mb-2"
                  />
                  <p className="font-semibold text-lg">{user.name}</p>
                  <p>Posts: {postCount}</p>
                  <p className="text-sm text-gray-500">Rank: {index + 1}</p> {/* Display rank */}
                </>
              ) : (
                <span>User data not found</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopUsers;