import React from 'react';
import Link from 'next/link';
import styles from '../../styles/components/Blog.module.css';

const BlogPostCard = ({ post }) => {
  return (
    <Link href={`/blog/${post.slug}`}>
      <a className={styles.card}>
        <img src={post.image} alt={post.title} className={styles.cardImage} />
        <div className={styles.cardContent}>
          <span className={styles.cardCategory}>{post.category}</span>
          <h3 className={styles.cardTitle}>{post.title}</h3>
          <p className={styles.cardExcerpt}>{post.excerpt}</p>
          <div className={styles.cardMeta}>
            <span>{post.author}</span>
            <span>{post.date}</span>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default BlogPostCard;
