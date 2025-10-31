import React, { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import styles from '../../styles/components/BlogPostPage.module.css';

const SANITIZE_OPTIONS = {
  allowedTags: ['p', 'h2', 'h3', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  transformTags: {
    a: (tagName, attribs) => {
      const sanitizedAttrs = { ...attribs };
      if (!sanitizedAttrs.rel) sanitizedAttrs.rel = 'noopener noreferrer';
      if (!sanitizedAttrs.target) sanitizedAttrs.target = '_blank';
      return {
        tagName,
        attribs: sanitizedAttrs,
      };
    },
  },
};

const BlogPostPage = ({ post }) => {
  const safeContent = useMemo(
    () => sanitizeHtml(post?.content ?? '', SANITIZE_OPTIONS),
    [post?.content]
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.category}>{post.category}</span>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span>Por {post.author}</span> | <span>{post.date}</span>
        </div>
      </header>
      <img src={post.image} alt={post.title} className={styles.mainImage} />
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: safeContent }} />
    </div>
  );
};

export default BlogPostPage;
