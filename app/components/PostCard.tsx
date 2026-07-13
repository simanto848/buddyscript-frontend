'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAxios } from '../../lib/api';
import { formatTimeAgo } from '../../lib/time';
import axios from 'axios';

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Reply {
  _id: string;
  comment: string;
  author: UserInfo;
  text: string;
  likes: UserInfo[];
  createdAt: string;
}

interface Comment {
  _id: string;
  post: string;
  author: UserInfo;
  text: string;
  likes: UserInfo[];
  replies: Reply[];
  createdAt: string;
}

interface PostCardProps {
  postId: string;
  avatar: string;
  name: string;
  time: string;
  title: string;
  postImage?: string;
  likesList: UserInfo[];
  visibility: string;
  currentUserId?: string;
  authorId: string;
  onPostDeleted?: (deletedPostId: string) => void;
}

export default function PostCard({
  postId,
  avatar,
  name,
  time,
  title,
  postImage,
  likesList,
  visibility,
  currentUserId,
  authorId,
  onPostDeleted
}: PostCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [likes, setLikes] = useState<UserInfo[]>(likesList);
  const [showLikesHover, setShowLikesHover] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [activeReplyInput, setActiveReplyInput] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(title);

  const hasLiked = currentUserId ? likes.some(user => user._id === currentUserId) : false;

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const api = await useAxios();
      const res: any = await api.get(`/posts/${postId}/comments`);
      if (res.success) {
        setComments(res.data);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const api = await useAxios();
      const res: any = await api.post(`/posts/${postId}/like`);
      if (res.success) {
        setLikes(res.data.likes);
      }
    } catch (error) {
      console.error('Failed to toggle post like:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const api = await useAxios();
      const res: any = await api.post(`/posts/${postId}/comments`, { text: newComment });
      if (res.success) {
        setNewComment('');
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      const api = await useAxios();
      const res: any = await api.post(`/comments/${commentId}/like`);
      if (res.success) {
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
    }
  };

  const handleReplySubmit = async (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    const replyText = replyTexts[commentId];
    if (!replyText || !replyText.trim()) return;

    try {
      const api = await useAxios();
      const res: any = await api.post(`/comments/${commentId}/replies`, { text: replyText });
      if (res.success) {
        setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
        setActiveReplyInput(null);
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  const handleReplyLike = async (replyId: string) => {
    try {
      const api = await useAxios();
      const res: any = await api.post(`/replies/${replyId}/like`);
      if (res.success) {
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to toggle reply like:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const api = await useAxios();
      const res: any = await api.delete(`/posts/${postId}`);
      if (res.success && onPostDeleted) {
        onPostDeleted(postId);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleUpdatePost = async () => {
    if (!editedText.trim()) return;
    try {
      const api = await useAxios();
      const res: any = await api.put(`/posts/${postId}`, { text: editedText });
      if (res.success) {
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const renderLikeTooltip = (likeUsers: UserInfo[]) => {
    if (likeUsers.length === 0) return 'No likes yet';
    return likeUsers.map(u => `${u.firstName} ${u.lastName}`).join(', ');
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src={avatar || '/images/profile.png'} alt={name} className="_post_img" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{name}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {formatTimeAgo(time)} . <span style={{ textTransform: 'capitalize' }}>{visibility}</span>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown" style={{ position: 'relative' }}>
            <div className="_feed_timeline_post_dropdown">
              <button
                type="button"
                className="_feed_timeline_post_dropdown_link"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
            {showDropdown && (
              <div
                className="_feed_timeline_dropdown _timeline_dropdown show"
                style={{ 
                  display: 'block', 
                  position: 'absolute', 
                  right: 0, 
                  top: '25px', 
                  zIndex: 10,
                  transform: 'none',
                  background: '#fff',
                  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  width: '280px'
                }}
              >
                <ul className="_feed_timeline_dropdown_list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  
                  {/* Save Post */}
                  <li className="_feed_timeline_dropdown_item" style={{ marginBottom: '12px' }}>
                    <button type="button" className="_feed_timeline_dropdown_link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 4px', fontSize: '14px', fontWeight: 500, color: '#333' }} onClick={() => setShowDropdown(false)}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EBF2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#377DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      Save Post
                    </button>
                  </li>

                  {/* Turn On Notification */}
                  <li className="_feed_timeline_dropdown_item" style={{ marginBottom: '12px' }}>
                    <button type="button" className="_feed_timeline_dropdown_link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 4px', fontSize: '14px', fontWeight: 500, color: '#333' }} onClick={() => setShowDropdown(false)}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EBF2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#377DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                      </div>
                      Turn On Notification
                    </button>
                  </li>

                  {/* Hide */}
                  <li className="_feed_timeline_dropdown_item" style={{ marginBottom: (currentUserId === authorId) ? '12px' : '0px' }}>
                    <button type="button" className="_feed_timeline_dropdown_link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 4px', fontSize: '14px', fontWeight: 500, color: '#333' }} onClick={() => setShowDropdown(false)}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EBF2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#377DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                        </svg>
                      </div>
                      Hide
                    </button>
                  </li>

                  {/* Edit Post (Author only) */}
                  {(currentUserId === authorId) && (
                    <li className="_feed_timeline_dropdown_item" style={{ marginBottom: '12px' }}>
                      <button type="button" className="_feed_timeline_dropdown_link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 4px', fontSize: '14px', fontWeight: 500, color: '#333' }} onClick={() => { setIsEditing(true); setShowDropdown(false); }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EBF2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#377DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </div>
                        Edit Post
                      </button>
                    </li>
                  )}

                  {/* Delete Post (Author only) */}
                  {(currentUserId === authorId) && (
                    <li className="_feed_timeline_dropdown_item">
                      <button type="button" className="_feed_timeline_dropdown_link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 4px', fontSize: '14px', fontWeight: 500, color: '#333' }} onClick={handleDeletePost}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EBF2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#377DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </div>
                        Delete Post
                      </button>
                    </li>
                  )}

                </ul>
              </div>
            )}
          </div>
        </div>
        {isEditing ? (
          <div style={{ marginTop: '14px', marginBottom: '14px' }}>
            <textarea
              className="form-control"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={3}
              style={{ background: 'var(--bg2)', color: 'var(--color6)', border: '1px solid var(--border-color, #ccc)' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleUpdatePost}>Save</button>
            </div>
          </div>
        ) : (
          <h4 className="_feed_inner_timeline_post_title" style={{ fontWeight: 'normal', whiteSpace: 'pre-wrap' }}>{title}</h4>
        )}
        {postImage && (
          <div className="_feed_inner_timeline_image" style={{ marginTop: '14px' }}>
            <img src={postImage} alt="Post media" className="_time_img" style={{ width: '100%', borderRadius: '6px', maxHeight: '500px', objectFit: 'cover' }} />
          </div>
        )}
      </div>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26" style={{ position: 'relative' }}>
        <div 
          className="_feed_inner_timeline_total_reacts_image" 
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setShowLikesHover(true)}
          onMouseLeave={() => setShowLikesHover(false)}
        >
          <img src="/images/react_img1.png" alt="React Icon" className="_react_img1" />
          <p className="_feed_inner_timeline_total_reacts_para">{likes.length} Likes</p>
          {showLikesHover && likes.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '25px',
              left: '24px',
              background: '#333',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              zIndex: 100,
              maxWidth: '250px',
              whiteSpace: 'normal',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              {renderLikeTooltip(likes)}
            </div>
          )}
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <button 
              onClick={() => setShowComments(!showComments)} 
              style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}
            >
              <span>{comments.length}</span> Comments
            </button>
          </p>
        </div>
      </div>
      
      <div className="_feed_inner_timeline_reaction">
        <button
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${hasLiked ? '_feed_reaction_active' : ''}`}
          onClick={handleLike}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                <path fill={hasLiked ? "#FF4D4F" : "#FFCC4D"} d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/>
                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"/>
                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/>
              </svg>
              {hasLiked ? 'Liked' : 'Like'}
            </span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction" onClick={() => setShowComments(!showComments)}>
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" strokeWidth="1.5" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"/>
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.938 9.313h7.125M10.5 14.063h3.563"/>
              </svg>
              Comment
            </span>
          </span>
        </button>
      </div>

      {showComments && (
        <div className="_feed_inner_timeline_cooment_area" style={{ borderTop: '1px solid var(--border-color)', marginTop: '12px' }}>
          <div className="_feed_inner_comment_box" style={{ padding: '16px 24px' }}>
            <form className="_feed_inner_comment_box_form" onSubmit={handleCommentSubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src="/images/comment_img.png" alt="" className="_comment_img" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                </div>
                <div className="_feed_inner_comment_box_content_txt" style={{ flex: 1 }}>
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCommentSubmit(e);
                      }
                    }}
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          {comments.length > 0 && (
            <div className="_timline_comment_main" style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
              {comments.map((comment) => {
                const hasLikedComment = currentUserId ? comment.likes.some(u => u._id === currentUserId) : false;
                return (
                  <div className="_previous_comment" key={comment._id} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <img
                        src={comment.author.avatar || '/images/profile.png'}
                        alt={comment.author.firstName}
                        className="_comment_img"
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div className="_comment_txt_wrap" style={{ background: 'rgba(0,0,0,0.03)', padding: '10px 14px', borderRadius: '8px', flex: 1, position: 'relative' }}>
                        <h5 className="_comment_name" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text1)', margin: '0 0 4px 0' }}>
                          {comment.author.firstName} {comment.author.lastName}
                        </h5>
                        <p className="_comment_text" style={{ fontSize: '13px', color: 'var(--text2)', margin: 0 }}>
                          {comment.text}
                        </p>
                        
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', alignItems: 'center' }}>
                          <button
                            onClick={() => handleCommentLike(comment._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: hasLikedComment ? 'bold' : 'normal', color: hasLikedComment ? '#FF4D4F' : '#888' }}
                          >
                            Like ({comment.likes.length})
                          </button>
                          <button
                            onClick={() => setActiveReplyInput(activeReplyInput === comment._id ? null : comment._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#888' }}
                          >
                            Reply
                          </button>
                          <span style={{ color: '#ccc' }}>
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>

                        {comment.likes.length > 0 && (
                          <div style={{ fontSize: '10px', color: '#777', marginTop: '4px' }}>
                            Liked by: {renderLikeTooltip(comment.likes)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="_comment_replies" style={{ paddingLeft: '42px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {comment.replies.map((reply) => {
                          const hasLikedReply = currentUserId ? reply.likes.some(u => u._id === currentUserId) : false;
                          return (
                            <div key={reply._id} style={{ display: 'flex', gap: '10px' }}>
                              <img
                                src={reply.author.avatar || '/images/profile.png'}
                                alt={reply.author.firstName}
                                style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '8px 12px', borderRadius: '8px', flex: 1 }}>
                                <h6 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 2px 0' }}>
                                  {reply.author.firstName} {reply.author.lastName}
                                </h6>
                                <p style={{ fontSize: '12px', margin: 0, color: '#555' }}>{reply.text}</p>
                                
                                <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontSize: '10px', alignItems: 'center' }}>
                                  <button
                                    onClick={() => handleReplyLike(reply._id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: hasLikedReply ? 'bold' : 'normal', color: hasLikedReply ? '#FF4D4F' : '#888' }}
                                  >
                                    Like ({reply.likes.length})
                                  </button>
                                  <span style={{ color: '#ccc' }}>
                                    {formatTimeAgo(reply.createdAt)}
                                  </span>
                                </div>

                                {reply.likes.length > 0 && (
                                  <div style={{ fontSize: '9px', color: '#777', marginTop: '2px' }}>
                                    Liked by: {renderLikeTooltip(reply.likes)}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Reply Input Field */}
                    {activeReplyInput === comment._id && (
                      <form 
                        onSubmit={(e) => handleReplySubmit(comment._id, e)}
                        style={{ paddingLeft: '42px', marginTop: '6px', display: 'flex', gap: '10px' }}
                      >
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Write a reply..."
                          style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '20px' }}
                          value={replyTexts[comment._id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment._id]: e.target.value }))}
                          autoFocus
                        />
                        <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '20px', fontSize: '12px' }}>
                          Reply
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
