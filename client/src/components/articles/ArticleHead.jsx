import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import AddArticleBtn from "./AddArticleBtn";
import { Link } from "react-router-dom";
import Sort from "@components/articles/Sort";
import { userRoles } from "@utils/userRoles";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import SearchArticle from "@components/articles/SearchArticles";

export default function ArticleHead({onStatusChange,onSearch}) {
  const currentUserRole = useAuthUser()?.role;
  const grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];

  return (
    <div className="mx-44 ">
      <div className="flex justify-between">
        <div>
          <h1 className="text-center text-5xl font-bold ">My Articles</h1>
        </div>
        <div>
        {currentUserRole == userRoles.Teacher ? (
          <Link to="/articles/addArticleForm">
            <AddArticleBtn />
          </Link>
        ): currentUserRole == userRoles.Moderator ?(
          <Link to="/articles/addArticleForm">
            <AddArticleBtn />
          </Link>
        ):(null)}
        </div>
      </div>
      <div className="flex justify-between items-center mt-12 mr-32">
        <div className="w-1/2">
            <Sort onStatusChange={onStatusChange} />
        </div>
        <div className="w-1/2">
            <SearchArticle onSearch={onSearch} isMyArticle={true}/>
        </div>
        {/* <Sort onStatusChange={onStatusChange} /> */}
      </div>
    </div>
  );
}
