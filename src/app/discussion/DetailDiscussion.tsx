import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Comments from './DiscussionCreateComment'; // Import komponen Comments
import CreateDiscussion from './CreateDiscussion'; // Import komponen CreateDiscussion

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  // Fetch posts with comments
  useEffect(() => {
    const fetchPostsWithComments = async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          *,
          replies:replies(post_id, id, comment, created_at, upvotes)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        const postsWithTopComments = posts.map((post) => {
          const topComments = (post.replies || [])
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 3);
          return { ...post, topComments };
        });
        setPosts(postsWithTopComments);
      }
    };

    fetchPostsWithComments();
  }, []);

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
      }

      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, upvotes: updatedUpvotes } : post
        )
      );

      console.log('Upvote updated successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const getUpvoteCount = (upvotes) => {
    return upvotes ? Object.keys(upvotes).length : 0;
  };

  const getCommentCount = (post) => {
    return post.replies ? post.replies.length : 0;
  };

  const openModal = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Forum Diskusi Inovasi</h1>
        <button
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300"
          onClick={openCreateModal}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah Diskusi
        </button>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-600">Belum ada diskusi. Jadilah yang pertama memulai diskusi!</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative"
            >
              <h2 className="text-xl font-semibold text-blue-600">{post.title}</h2>
              <p className="text-gray-700 mt-2">{post.description}</p>
              <div className="text-gray-500 text-sm mt-4">
                {new Date(post.created_at).toLocaleString()}
              </div>
              <div className="mt-2 text-gray-600 flex items-center">
                <span className="mr-2">{getUpvoteCount(post.upvotes)}</span>
                <button
                  onClick={() => handleUpvote(post.id, userId)}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-300 mr-4"
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                <span className="mr-2">{getCommentCount(post)}</span>
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                  onClick={() => openModal(post.id)}
                >
                  <FontAwesomeIcon icon={faComment} />
                </button>
              </div>
              {post.topComments && post.topComments.length > 0 && (
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    onClick={() => {
                      const updatedPosts = posts.map((p) =>
                        p.id === post.id ? { ...p, showComments: !p.showComments } : p
                      );
                      setPosts(updatedPosts);
                    }}
                  >
                    {post.showComments ? 'Sembunyikan komentar' : 'Lihat komentar'}
                  </button>
                  {post.showComments && (
                    <ul className="space-y-2 mt-2">
                      {post.topComments.map((comment) => (
                        <li
                          key={comment.id}
                          className="text-gray-700 ml-6 pl-4 border-l-2 border-gray-300"
                        >
                          <p>{comment.comment}</p>
                          <small className="text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </small>
                        </li>
                      ))}
                      <li
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300 cursor-pointer"
                      onClick={() => openModal(post.id)}
                      >
                      Lihat komentar selengkapnya
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && selectedPostId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <Comments postId={selectedPostId} />
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeCreateModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <CreateDiscussion onClose={closeCreateModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
