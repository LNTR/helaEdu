import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import HTMLReactParser from "html-react-parser";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Article({articleId,publishedTimestamp, alignment, img ,title,content,author,upvoteCount,commentCount}) {

  const navigate=useNavigate();
  
  const navigatePage = (articleId) => {
    navigate(`/articles/readArticles/${articleId}`);
  };
  return (
    <div className={`article ${alignment}`}>
      <div className="article-content-wrapper">
        <div className="article-left-panel">
          <div className="article-content">
            <div className="meta flex-sb">
              <div className="title">
                <h3>{title}</h3>
                <h5>{publishedTimestamp}</h5>
              </div>
              <div className="profile">
                <FontAwesomeIcon icon={faCircleUser} className="user-logo" />
                <h4>{author.firstName}  {author.lastName}</h4>
              </div>
            </div>
            <div className="content">
              <h4>
                {HTMLReactParser(content)}
              </h4>
            </div>
            <div className="control">
              <div className="stat-details">
                <h4>{upvoteCount} likes</h4>
                <h4>{commentCount} comments</h4>
              </div>
              <div className="buttons flex">
                <div>
                  <button className="blue-button flex-sb bookmark-button">
                    <FontAwesomeIcon icon={faBookmark} size="2x" />
                    <h4>Read Later</h4>
                  </button>
              
                </div>
                <div>
                  <button className="blue-button " onClick={() => navigatePage(articleId)}>
                    <h4>Read Now</h4>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="article-right-panel">
          <img src={img} alt="" srcSet="" />
        </div>
      </div>
    </div>
  );
}

export default Article;
