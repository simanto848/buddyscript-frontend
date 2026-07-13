'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAxios } from '../../lib/api';
import { formatTimeAgo } from '../../lib/time';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import Avatar from './Avatar';

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
  avatar?: string;
  name: string;
  authorFirstName?: string;
  authorLastName?: string;
  time: string;
  title: string;
  postImage?: string;
  likesList: UserInfo[];
  visibility: string;
  currentUserId?: string;
  currentUserAvatar?: string;
  currentUserFirstName?: string;
  currentUserLastName?: string;
  authorId: string;
  onPostDeleted?: (deletedPostId: string) => void;
}

export default function PostCard({
  postId,
  avatar,
  name,
  authorFirstName,
  authorLastName,
  time,
  title,
  postImage,
  likesList,
  visibility,
  currentUserId,
  currentUserAvatar,
  currentUserFirstName,
  currentUserLastName,
  authorId,
  onPostDeleted
}: PostCardProps) {
  const { darkMode } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [likes, setLikes] = useState<UserInfo[]>(likesList);
  const [showLikesHover, setShowLikesHover] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [modalLikes, setModalLikes] = useState<UserInfo[]>([]);
  const [hoveredReactId, setHoveredReactId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [activeReplyInput, setActiveReplyInput] = useState<string | null>(null);
  const [openCommentMenuId, setOpenCommentMenuId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(title);
  const [editedVisibility, setEditedVisibility] = useState(visibility);

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

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      const api = await useAxios();
      const res: any = await api.delete(`/comments/${commentId}`);
      if (res.success) {
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleReplyDelete = async (replyId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    try {
      const api = await useAxios();
      const res: any = await api.delete(`/replies/${replyId}`);
      if (res.success) {
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to delete reply:', error);
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
      const res: any = await api.put(`/posts/${postId}`, { text: editedText, visibility: editedVisibility });
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
            <div className="_feed_inner_timeline_post_box_image" style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden' }}>
              <Avatar avatarUrl={avatar} firstName={authorFirstName || name.split(' ')[0]} lastName={authorLastName || name.split(' ')[1]} size="42px" />
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
          <div style={{ marginTop: '14px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>Update Privacy:</span>
              <select 
                className="form-select form-select-sm" 
                style={{ width: '100px', borderRadius: '20px', fontSize: '11px', height: '26px', border: '1px solid var(--border-color, #ccc)', background: 'var(--bg2)', color: 'var(--color6)' }}
                value={editedVisibility}
                onChange={(e) => setEditedVisibility(e.target.value)}
              >
                <option value="public">🌍 Public</option>
                <option value="private">🔒 Private</option>
              </select>
            </div>
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
        {likes.length > 0 ? (
          <div 
            className="_feed_inner_timeline_total_reacts_image" 
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setShowLikesHover(true)}
            onMouseLeave={() => setShowLikesHover(false)}
            onClick={() => { setModalLikes(likes); setShowLikesModal(true); }}
          >
            {likes.slice(0, 5).map((user, index) => {
              const isFirst = index === 0;
              const imgClass = isFirst ? '_react_img1' : '_react_img';
              return (
                <img
                  key={user._id}
                  src={user.avatar || '/images/profile.png'}
                  alt={`${user.firstName} ${user.lastName}`}
                  className={imgClass}
                  style={{ borderRadius: '50%', objectFit: 'cover', width: '18px', height: '18px' }}
                />
              );
            })}
            <p className="_feed_inner_timeline_total_reacts_para">{likes.length}</p>
            {showLikesHover && (
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
        ) : (
          <div />
        )}
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <button 
              onClick={() => setShowComments(!showComments)} 
              style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}
            >
              <span>{comments.length}</span> Comment
            </button>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>0</span> Share
          </p>
        </div>
      </div>
      
      <div className="_feed_inner_timeline_reaction">
        <button
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${hasLiked ? '_feed_reaction_active' : ''}`}
          onClick={handleLike}
          style={hasLiked ? { color: '#377DFF', fontWeight: 'bold' } : undefined}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/>
                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"/>
                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/>
              </svg>
              Haha
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
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeWidth="1.5" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"/>
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      {showComments && (
        <div className="_feed_inner_timeline_cooment_area">
          <div className="_feed_inner_comment_box">
            <form className="_feed_inner_comment_box_form" onSubmit={handleCommentSubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image" style={{ width: '32px', height: '32px' }}>
                  <Avatar avatarUrl={currentUserAvatar} firstName={currentUserFirstName} lastName={currentUserLastName} size="32px" fontSize="11px" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
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
              <div className="_feed_inner_comment_box_icon">
                <button type="button" className="_feed_inner_comment_box_icon_btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                  </svg>
                </button>
                <button type="button" className="_feed_inner_comment_box_icon_btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {comments.length > 0 && (
            <div className="_timline_comment_main" style={{ paddingBottom: '16px' }}>
              {comments.map((comment) => {
                const hasLikedComment = currentUserId ? comment.likes.some(u => u._id === currentUserId) : false;
                return (
                  <div key={comment._id} style={{ marginBottom: '16px' }}>
                    <div className="_comment_main">
                      <div className="_comment_image">
                        <Link href="#" className="_comment_image_link">
                          <Avatar avatarUrl={comment.author.avatar} firstName={comment.author.firstName} lastName={comment.author.lastName} size="32px" fontSize="11px" />
                        </Link>
                      </div>
                      <div className="_comment_area">
                        <div className="_comment_details">
                          <div className="_comment_details_top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="_comment_name">
                              <Link href="#">
                                <h4 className="_comment_name_title">
                                  {comment.author.firstName} {comment.author.lastName}
                                </h4>
                              </Link>
                            </div>
                            {(comment.author._id === currentUserId || authorId === currentUserId) && (
                              <div style={{ position: 'relative' }}>
                                <button
                                  type="button"
                                  onClick={() => setOpenCommentMenuId(openCommentMenuId === comment._id ? null : comment._id)}
                                  style={{ background: 'none', border: 'none', padding: '0 4px', cursor: 'pointer', opacity: 0.6 }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                                  </svg>
                                </button>
                                {openCommentMenuId === comment._id && (
                                  <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '20px',
                                    background: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    zIndex: 100,
                                    minWidth: '100px'
                                  }}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleCommentDelete(comment._id);
                                        setOpenCommentMenuId(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        fontSize: '12px',
                                        color: '#FF4D4F',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="_comment_status">
                            <p className="_comment_status_text">
                              <span>{comment.text}</span>
                            </p>
                          </div>
                          {comment.likes.length > 0 && (
                            <div 
                              className="_total_reactions" 
                              style={{ position: 'absolute', bottom: '-15px', right: '15px', zIndex: 10, cursor: 'pointer' }}
                              onClick={() => { setModalLikes(comment.likes); setShowLikesModal(true); }}
                              onMouseEnter={() => setHoveredReactId(comment._id)}
                              onMouseLeave={() => setHoveredReactId(null)}
                            >
                              <div className="_total_react">
                                <span className="_reaction_like">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up" style={{ color: '#377DFF' }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                </span>
                                <span className="_reaction_heart">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart" style={{ color: '#FF4D4F' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                </span>
                              </div>
                              <span className="_total">
                                {comment.likes.length}
                              </span>
                              {hoveredReactId === comment._id && (
                                <div style={{
                                  position: 'absolute',
                                  bottom: '22px',
                                  right: '0px',
                                  background: '#333',
                                  color: '#fff',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  zIndex: 100,
                                  minWidth: '100px',
                                  whiteSpace: 'nowrap',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                }}>
                                  {renderLikeTooltip(comment.likes)}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="_comment_reply">
                            <div className="_comment_reply_num" style={{ whiteSpace: 'nowrap' }}>
                              <ul className="_comment_reply_list">
                                <li>
                                  <span
                                    onClick={() => handleCommentLike(comment._id)}
                                    style={{ cursor: 'pointer', fontWeight: hasLikedComment ? 'bold' : 'normal', color: hasLikedComment ? '#FF4D4F' : 'inherit' }}
                                  >
                                    Like.
                                  </span>
                                </li>
                                <li>
                                  <span
                                    onClick={() => setActiveReplyInput(activeReplyInput === comment._id ? null : comment._id)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    Reply.
                                  </span>
                                </li>
                                <li>
                                  <span style={{ cursor: 'pointer' }}>
                                    Share.
                                  </span>
                                </li>
                                <li>
                                  <span className="_time_link">
                                    {formatTimeAgo(comment.createdAt)}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.map((reply) => {
                      const hasLikedReply = currentUserId ? reply.likes.some(u => u._id === currentUserId) : false;
                      return (
                        <div className="_comment_main" key={reply._id} style={{ marginLeft: '45px', marginTop: '12px' }}>
                          <div className="_comment_image">
                            <Link href="#" className="_comment_image_link">
                              <Avatar avatarUrl={reply.author.avatar} firstName={reply.author.firstName} lastName={reply.author.lastName} size="28px" fontSize="10px" />
                            </Link>
                          </div>
                          <div className="_comment_area">
                            <div className="_comment_details">
                               <div className="_comment_details_top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="_comment_name">
                                  <Link href="#">
                                    <h4 className="_comment_name_title" style={{ fontSize: '13px' }}>
                                      {reply.author.firstName} {reply.author.lastName}
                                    </h4>
                                  </Link>
                                </div>
                                {(reply.author._id === currentUserId || authorId === currentUserId) && (
                                  <div style={{ position: 'relative' }}>
                                    <button
                                      type="button"
                                      onClick={() => setOpenCommentMenuId(openCommentMenuId === reply._id ? null : reply._id)}
                                      style={{ background: 'none', border: 'none', padding: '0 4px', cursor: 'pointer', opacity: 0.6 }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                                      </svg>
                                    </button>
                                    {openCommentMenuId === reply._id && (
                                      <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '20px',
                                        background: '#fff',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        zIndex: 100,
                                        minWidth: '100px'
                                      }}>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleReplyDelete(reply._id);
                                            setOpenCommentMenuId(null);
                                          }}
                                          style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            background: 'none',
                                            border: 'none',
                                            textAlign: 'left',
                                            fontSize: '12px',
                                            color: '#FF4D4F',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="_comment_status">
                                <p className="_comment_status_text" style={{ fontSize: '13px' }}>
                                  <span>{reply.text}</span>
                                </p>
                              </div>
                              {reply.likes.length > 0 && (
                                <div 
                                  className="_total_reactions" 
                                  style={{ position: 'absolute', bottom: '-15px', right: '15px', zIndex: 10, cursor: 'pointer' }}
                                  onClick={() => { setModalLikes(reply.likes); setShowLikesModal(true); }}
                                  onMouseEnter={() => setHoveredReactId(reply._id)}
                                  onMouseLeave={() => setHoveredReactId(null)}
                                >
                                  <div className="_total_react">
                                    <span className="_reaction_like">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up" style={{ color: '#377DFF' }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                    </span>
                                    <span className="_reaction_heart">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart" style={{ color: '#FF4D4F' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    </span>
                                  </div>
                                  <span className="_total" style={{ fontSize: '11px' }}>
                                    {reply.likes.length}
                                  </span>
                                  {hoveredReactId === reply._id && (
                                    <div style={{
                                      position: 'absolute',
                                      bottom: '22px',
                                      right: '0px',
                                      background: '#333',
                                      color: '#fff',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      fontSize: '10px',
                                      zIndex: 100,
                                      minWidth: '100px',
                                      whiteSpace: 'nowrap',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                    }}>
                                      {renderLikeTooltip(reply.likes)}
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="_comment_reply">
                                <div className="_comment_reply_num" style={{ whiteSpace: 'nowrap' }}>
                                  <ul className="_comment_reply_list">
                                    <li>
                                      <span
                                        onClick={() => handleReplyLike(reply._id)}
                                        style={{ cursor: 'pointer', fontSize: '11px', fontWeight: hasLikedReply ? 'bold' : 'normal', color: hasLikedReply ? '#FF4D4F' : 'inherit' }}
                                      >
                                        Like.
                                      </span>
                                    </li>
                                    <li>
                                      <span style={{ cursor: 'pointer', fontSize: '11px' }}>
                                        Reply.
                                      </span>
                                    </li>
                                    <li>
                                      <span style={{ cursor: 'pointer', fontSize: '11px' }}>
                                        Share.
                                      </span>
                                    </li>
                                    <li>
                                      <span className="_time_link" style={{ fontSize: '11px' }}>
                                        {formatTimeAgo(reply.createdAt)}
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Reply Input Box */}
                    <div className="_feed_inner_comment_box" style={{ marginLeft: '45px', marginTop: '12px' }}>
                      <form className="_feed_inner_comment_box_form" onSubmit={(e) => handleReplySubmit(comment._id, e)}>
                        <div className="_feed_inner_comment_box_content">
                          <div className="_feed_inner_comment_box_content_image" style={{ width: '28px', height: '28px' }}>
                            <Avatar avatarUrl={currentUserAvatar} firstName={currentUserFirstName} lastName={currentUserLastName} size="28px" fontSize="10px" />
                          </div>
                          <div className="_feed_inner_comment_box_content_txt">
                            <textarea
                              className="form-control _comment_textarea"
                              placeholder="Write a reply..."
                              value={replyTexts[comment._id] || ''}
                              onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment._id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleReplySubmit(comment._id, e);
                                }
                              }}
                              style={{ fontSize: '13px' }}
                            ></textarea>
                          </div>
                        </div>
                        <div className="_feed_inner_comment_box_icon">
                          <button type="button" className="_feed_inner_comment_box_icon_btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                              <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button type="button" className="_feed_inner_comment_box_icon_btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                              <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {showLikesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: darkMode ? '#1F2937' : '#fff',
            color: darkMode ? '#fff' : '#000',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Reactions</h3>
              <button 
                onClick={() => setShowLikesModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: darkMode ? '#ccc' : '#666',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {modalLikes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No reactions yet</div>
              ) : (
                modalLikes.map((user) => (
                  <div key={user._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <img 
                      src={user.avatar || '/images/profile.png'} 
                      alt={`${user.firstName} ${user.lastName}`} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
