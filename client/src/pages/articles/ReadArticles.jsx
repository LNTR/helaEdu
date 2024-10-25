import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AddArticleBtn from "@/components/articles/AddArticleBtn";
import CommentList from "@/components/articles/CommentList";
import PopArticleCard from "@/components/articles/PopArticleCard";
import ViewArticle from "@/components/articles/ViewArticle";
import { Header, Footer } from "@/components/common";
import { getArticleById, reccomendArticles } from "@/services/ArticleService";
import { getUserDetails } from "@services/TeacherService";
import { userRoles } from "@utils/userRoles";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function ReadArticle() {
  const currentUserRole = useAuthUser()?.role;
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);

  const [reccomendedArticleList, setReccomendedArticles] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await getArticleById(articleId);
        const article = response.data;

        const userResponse = await getUserDetails(article.userId);
        const userDetails = userResponse.data;

        const articleWithUserDetails = {
          ...article,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          userId: userDetails.userId,
          coverImage: userDetails.profilePictureUrl,
        };

        setArticle(articleWithUserDetails);
      } catch (error) {
        console.error("Failed to fetch article", error);
      }
    };

    fetchArticle();
  }, [articleId]);

  useEffect(() => {
    const fetchReccomendations = async () => {
      const clusterId = article?.cluster;
      let articleList = (await reccomendArticles(clusterId)).data;
      setReccomendedArticles(articleList);
    };
    if (article) {
      fetchReccomendations();
    }
  }, [article]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="flex justify-between mx-24">
        <div className="w-8/12">
          <ViewArticle
            articleId={article.articleId}
            title={article.title}
            content={article.content}
            tags={article.tags}
            firstName={article.firstName}
            lastName={article.lastName}
            userProfile={article.coverImage}
            date={article.publishedTimestamp}
            imageRef={article.imageRef}
            additionalFilesRefs={article.additionalFilesRefs}
            articleAuthorId={article.userId}
            upvote={article.upvote}
          />
        </div>
        <div className="m-12 w-3/12">
          <h1>Recommended Articles</h1>
          <hr className="border-yellow border-t-4 w-4/4"></hr>
          <br />
          {reccomendedArticleList.map((topArticle, index) =>
            articleId == topArticle.articleId ? (
              <></>
            ) : (
              <div key={index}>
                <PopArticleCard
                  title={topArticle.title}
                  userName={topArticle.authorName}
                  userProfile={topArticle.profilePictureUrl}
                  date={topArticle.publishedTimestamp}
                  imageRef={topArticle.imageRef}
                />
                <br />
              </div>
            )
          )}
          <br />
          {currentUserRole == userRoles.Teacher ? (
            <Link to="/articles/addArticleForm">
              <AddArticleBtn />
            </Link>
          ) : currentUserRole == userRoles.Moderator ? (
            <Link to="/articles/addArticleForm">
              <AddArticleBtn />
            </Link>
          ) : null}
          <iframe title="dummy"></iframe>
        </div>
      </div>
      <div className="mx-24">
        <CommentList />
      </div>
      <Footer />
    </div>
  );
}
