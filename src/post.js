import React from 'react';

export default function Post(props) {
  return (
    <div className="post">
      <p className="post-name">{props.name}</p>
      <p className="post-desc">{props.desc}</p>
    </div>
  );
}

export function Posts(props) {
  if (props.posts.length > 0) {
    return props.posts.map(post => <Post name={post.name} desc={post.desc} key={post.id} />);
  } else {
    return <h1>Loading...</h1>
  }
}
