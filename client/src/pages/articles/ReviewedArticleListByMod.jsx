import React, { useState, useEffect } from "react";
import Header from "@components/common/Header";
import ArticleCard from "@components/articles/ArticleCard";
import { reviewedArticlesByMod } from "@services/TeacherService";
import { getUserDetails } from "@services/TeacherService";
import { Link } from "react-router-dom";
import Sort from "@components/articles/Sort";
import Sidebar from "@components/moderator_com/ModeratorSidebar";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import ArticleCardMe from "@components/articles/ArticleCardMe";

export default function ReviewedArticleListByMod() {

  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  const [articles, setArticles] = useState([]); 
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    const fetchReviewedArticles = async () => {
      try {
        const response = await reviewedArticlesByMod(headers);
        const articles = response.data;
        console.log(articles);

        const articlesWithUserDetails = await Promise.all(
          articles.map(async (article) => {
            console.log(article.userId);
            const userResponse = await getUserDetails(article.userId); 
            const userDetails = userResponse.data;
            return {
              ...article,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              coverImage: userDetails.profilePictureUrl,
            };
          })
        );

        setArticles(articlesWithUserDetails);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviewedArticles();
  }, []);

  return (
    <>
      <Header />
      <div className="dashboard h-screen mx-auto" style={{ width: sidebar ? `calc(100vw - 384px)` : '100vw' }} onClick={() => setSidebar(false)}>
          <Sidebar value={sidebar} setValue={setSidebar} />
          <div className="content-wrapper mx-32">
            <div className="flex ">
              <div className="my-16 ">
                <h1>Reviewed Articles</h1>
                <hr className="border-yellow border-t-4 "></hr>
              </div>
            </div>
            <div>
              {/* <Sort /> */}
            </div>
            {articles.length > 0  ?
                <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                    {articles.map((article) => (
                        <div key={article.articleId} className="p-2">
                            <Link to={`/articles/reviewArticle/${article.articleId}`}>
                                <ArticleCardMe
                                key={article.articleId}
                                imageUrl={article.imageRef}
                                profilePictureUrl={article.coverImage}
                                firstName={article.firstName}
                                lastName={article.lastName}
                                date={article.publishedTimestamp}
                                title={article.title}
                                description={article.content}
                                badges={article.tags}
                                status={article.status}
                                />
                            </Link>
                        </div>
                    )) } 
                </div>
            : <p className="text-black text-3xl text-center mt-60">No any reviewed Articles</p>

            }
          </div>
        </div>
    
    </>
  );
}
