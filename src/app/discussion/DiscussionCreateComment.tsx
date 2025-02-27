import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const Comments = ({ postId }) => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [userId, setUserId] = useState(null);

  // Fetch user login
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        setUserId(null);
      }
    };

    fetchUser();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchPostsWithComments = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          replies:replies(id, comment, upvotes, created_at)
        `)
        .eq('id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setPosts(data);
        if (data.length > 0) {
          setPostTitle(data[0].title);
          setPostContent(data[0].description);
        }
      }
    };

    fetchPostsWithComments();
  }, [postId]);

  // Handle upvote
  const handleUpvote = async (postId, userId) => {
    if (!userId) {
      alert('Anda harus login untuk memberikan upvote.');
      return;
    }

    try {
      // Fetch post to update upvotes
      const { data: post, error } = await supabase
        .from('posts')
        .select('upvotes')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        return;
      }

      // Update upvotes
      const updatedUpvotes = post.upvotes ? { ...post.upvotes } : {};
      if (!updatedUpvotes[userId]) {
        updatedUpvotes[userId] = true; // Add like
      } else {
        delete updatedUpvotes[userId]; // Remove like
      }

      // Update upvotes in Supabase
      const { error: updateError } = await supabase
        .from('posts')
        .update({ upvotes: updatedUpvotes })
        .eq('id', postId);

      if (updateError) {
        console.error('Error updating upvotes:', updateError);
        return;
      };

      console.log('Upvote updated successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const getUpvoteCount = (upvotes) => {
    return upvotes ? Object.keys(upvotes).length : 0;
  };

  const getCommentCount = (replies) => {
    return replies ? replies.length : 0;
  };

  const handleSubmit = async (e) => {
    if (!userId) {
      alert('Anda harus login untuk memberikan upvote.');
      return;
    }

    try {
      e.preventDefault();

      const { error } = await supabase
        .from('replies')
        .insert([{ post_id: postId, comment: commentText }]);
  
      if (error) {
        console.error(error);
        alert('Gagal menambahkan komentar.');
      } else {
        setCommentText('');
        alert('Komentar berhasil ditambahkan!');
        // Refresh comments
        const { data } = await supabase
        .from('posts')
        .select(`
          *,
          replies:replies(id, comment, upvotes, created_at)
        `)
        .eq('id', postId)
        .order('created_at', { ascending: true });
        setPosts(data);
      }

    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan komentar.');
    }
    
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 p-6 rounded-lg shadow-lg mt-6">
      <div className="lg:w-2/5 bg-white p-6 rounded-lg shadow-md mr-6">
        <div className="space-y-4 max-h-50 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{postTitle}</h2>
          <p className="text-gray-700">{postContent}</p>
          <div className="mt-2 text-gray-600 flex items-center">
                <span className="mr-2">{posts[0] ? getUpvoteCount(posts[0].replies.upvotes) : 0}</span>
                <button
                  onClick={() => handleUpvote(postId, userId)}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-300 mr-4"
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                <span className="mr-2">{posts[0] ? getCommentCount(posts[0].replies) : 0}</span>
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faComment} />
                </button>
              </div>
              <br/>
        </div>
        {!userId ? (
        <div className="bg-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 space-y-4">
          Harus login untuk menambahkan komentar baru.
        </div>
      ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <textarea
            placeholder="Tambahkan komentar..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Kirim Komentar
          </button>
        </form>

      )}
        
      </div>
      <div className="w-full lg:w-3/5 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Komentar</h3>
        <ul className="space-y-4 max-h-96 overflow-y-auto">
          {posts.length === 0 || !posts[0].replies || posts[0].replies.length === 0 ? (
            <p className="text-gray-600">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
          ) : (
            posts[0].replies.map((replies) => (
              <li
                key={replies.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-gray-800">{replies.comment}</p>
                <small className="text-gray-500">
                  {new Date(replies.created_at).toLocaleString()}
                </small>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Comments;
