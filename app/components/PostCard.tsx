'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Comment {
  avatar: string;
  name: string;
  text: string;
  time: string;
}

interface PostCardProps {
  avatar: string;
  name: string;
  time: string;
  title: string;
  postImage?: string;
  likes: number;
  commentsCount: number;
  shares: number;
  initialComments?: Comment[];
}

export default function PostCard({
  avatar,
  name,
  time,
  title,
  postImage,
  likes,
  commentsCount,
  shares,
  initialComments = []
}: PostCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [likesState, setLikesState] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (hasLiked) {
      setLikesState(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikesState(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj: Comment = {
      avatar: '/images/profile.png',
      name: 'Dylan Field',
      text: newComment,
      time: 'Just now'
    };

    setComments(prev => [commentObj, ...prev]);
    setNewComment('');
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src={avatar} alt={name} className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{name}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {time} . <Link href="#">Public</Link>
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
                style={{ display: 'block', position: 'absolute', right: 0, top: '25px', zIndex: 10 }}
              >
                <ul className="_feed_timeline_dropdown_list">
                  <li className="_feed_timeline_dropdown_item">
                    <Link href="#" className="_feed_timeline_dropdown_link" onClick={() => setShowDropdown(false)}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                          <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"/>
                        </svg>
                      </span>
                      Save Post
                    </Link>
                  </li>
                  <li className="_feed_timeline_dropdown_item">
                    <Link href="#" className="_feed_timeline_dropdown_link" onClick={() => setShowDropdown(false)}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                          <path fill="#377DFF" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd"/>
                        </svg>
                      </span>
                      Notification
                    </Link>
                  </li>
                  <li className="_feed_timeline_dropdown_item">
                    <Link href="#" className="_feed_timeline_dropdown_link" onClick={() => setShowDropdown(false)}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                          <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"/>
                        </svg>
                      </span>
                      Hide
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{title}</h4>
        {postImage && (
          <div className="_feed_inner_timeline_image">
            <img src={postImage} alt="Post media" className="_time_img" />
          </div>
        )}
      </div>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <img src="/images/react_img1.png" alt="React Icon" className="_react_img1" />
          <img src="/images/react_img2.png" alt="React Icon" className="_react_img" />
          <img src="/images/react_img3.png" alt="React Icon" className="_react_img _rect_img_mbl_none" />
          <p className="_feed_inner_timeline_total_reacts_para">{likesState}</p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <Link href="#"><span>{comments.length}</span> Comment</Link>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>{shares}</span> Share</p>
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
                <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/>
                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"/>
                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/>
              </svg>
              {hasLiked ? 'Haha' : 'Like'}
            </span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
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
      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form className="_feed_inner_comment_box_form" onSubmit={handleCommentSubmit}>
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                <img src="/images/comment_img.png" alt="" className="_comment_img" />
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea
                  className="form-control _comment_textarea"
                  placeholder="Write a comment"
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
              <button type="submit" className="_feed_inner_comment_box_icon_btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      {comments.length > 0 && (
        <div className="_timline_comment_main" style={{ paddingLeft: '24px', paddingRight: '24px', marginTop: '15px' }}>
          {comments.map((comment, index) => (
            <div className="_previous_comment" key={index} style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
              <img
                src={comment.avatar}
                alt={comment.name}
                className="_comment_img"
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
              <div className="_comment_txt_wrap" style={{ background: 'var(--bg2)', padding: '10px 14px', borderRadius: '8px', flex: 1 }}>
                <h5 className="_comment_name" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text1)', margin: '0 0 4px 0' }}>{comment.name}</h5>
                <p className="_comment_text" style={{ fontSize: '13px', color: 'var(--text2)', margin: 0 }}>{comment.text}</p>
                <span className="_comment_time" style={{ fontSize: '11px', color: '#888', marginTop: '4px', display: 'inline-block' }}>{comment.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
