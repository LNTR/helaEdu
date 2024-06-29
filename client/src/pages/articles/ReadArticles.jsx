import AddArticleBtn from "@components/articles/AddArticleBtn";
import AddComment from "@components/articles/AddComment";
import CommentList from "@components/articles/CommentList";
import Comments from "@components/articles/Comments";
import PopArticleCard from "@components/articles/PopArticleCard";
import ViewArticle from "@components/articles/ViewArticle";
import React from "react";
import { Footer, Header } from "@components/common";

export default function ReadArticle() {
  return (
    <div>
      <Header />
      <div className="flex justify-between">
        <div className="w-5/6">
          <ViewArticle />
        </div>
        <div className="m-12">
          <h1>Top Articles</h1>
          <hr></hr>
          <br></br>
          <PopArticleCard />
          <PopArticleCard />
          <PopArticleCard />
          <PopArticleCard />
          <PopArticleCard />
          <AddArticleBtn />
          <iframe></iframe>
        </div>
      </div>
      <div>
        <CommentList />
        {/* <Comments /> */}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
