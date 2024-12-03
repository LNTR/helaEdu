import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import AddArticleBtn from "./AddArticleBtn";
import { Link } from "react-router-dom";
import { userRoles } from "@utils/userRoles";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import SearchArticle from "./SearchArticles";


export default function ArticleHeadForAll({onSearch}) {
  const currentUserRole = useAuthUser()?.role;


  return (
    <div className="mx-44 ">
      <div className="flex justify-between">
        <div>
          <h1 className="text-center text-5xl font-bold ">Articles</h1>
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
      <div className="flex justify-center items-center mt-12">
      
        <div>
            <SearchArticle onSearch={onSearch} isMyArticle={false}/>
        </div>
        {/* <Sort onStatusChange={onStatusChange} /> */}
        
      </div>
    </div>
  );
}
