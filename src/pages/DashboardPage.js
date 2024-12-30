import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../App.css';


const DashboardPage = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [editingPost, setEditingPost] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

    // Get all posts (use useCallback to memoize the function)
    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/posts/getAll', {
                requestInfo: {
                    token: token,
                    timestamp: new Date().toISOString(),
                },
                data: null,
            });
            setPosts(response.data.data);
        } catch (error) {
            setError('Error fetching posts.');
        }
    }, [token]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]); // Add fetchPosts to the dependency array

    // Create a new post
    const createPost = async () => {
        try {
            await axios.post('http://localhost:8080/api/v1/posts', {
                requestInfo: {
                    token: token,
                    timestamp: new Date().toISOString(),
                },
                data: {
                    title: newPost.title,
                    content: newPost.content,
                    status: 'published',
                },
            });

            // Instead of manually updating the posts array, refetch all posts
            fetchPosts();

            setNewPost({ title: '', content: '' }); // Reset form
        } catch (error) {
            setError('Error creating post.');
        }
    };

    // Edit a post
    const updatePost = async (id) => {
        try {
             await axios.put(`http://localhost:8080/api/v1/posts`, {
                requestInfo: {
                    token: token,
                    timestamp: new Date().toISOString(),
                },
                data: {
                    id:id,
                    title: editingPost.title,
                    content: editingPost.content,
                    status: 'published',
                },
            });

            // Update the local posts state after editing
            fetchPosts();
                    setEditingPost(null); // Reset editing state
        } catch (error) {
            setError('Error updating post.');
        }
    };

    // Delete a post
    const deletePost = async (id) => {
        try {
            await axios.post('http://localhost:8080/api/v1/posts/delete', {
                requestInfo: {
                    token: token,
                    timestamp: new Date().toISOString(),
                },
                data: {
                    id: id,
                },
            });

            // Refetch posts after deletion to ensure the state is updated
            fetchPosts();
        } catch (error) {
            setError('Error deleting post.');
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            {error && <div className="error">{error}</div>}

            <div className="new-post">
                <h2>Create New Post</h2>
                <input
                    type="text"
                    placeholder="Post Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <textarea
                    placeholder="Post Content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                <button onClick={createPost}>Create Post</button>
            </div>

            <div className="posts">
        <h2>All Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="post">
            {editingPost && editingPost.id === post.id ? (
              <div className="edit-post">
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                />
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                />
                <div className="post-actions">
                  <button onClick={() => updatePost(post.id)}>Save</button>
                  <button onClick={() => setEditingPost(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p><strong>By: {post.user ? post.user.username : 'Unknown'}</strong></p>
                <p>Status: {post.status}</p>
                <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                <div className="post-actions">
                  <button onClick={() => setEditingPost({ ...post })}>Edit</button>
                  <button onClick={() => deletePost(post.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;