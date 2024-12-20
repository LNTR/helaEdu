import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AddArticleBtn from "@/components/articles/AddArticleBtn";
import CommentList from "@/components/articles/CommentList";
import PopArticleCard from "@/components/articles/PopArticleCard";
import ViewArticle from "@/components/articles/ViewArticle";
import { Header, Footer } from "@/components/common";
import { getArticleById, reccomendArticles } from "@/services/ArticleService";
import { getUserDetails } from "@services/TeacherService";
import { userRoles } from "@utils/userRoles";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import LoadingComponent from "@components/common/LoadingComponent";

export default function ReadArticle() {
  const currentUserRole = useAuthUser()?.role;
  const { articleId } = useParams();
  const navigate = useNavigate(); // Initialize the navigate function
  const [article, setArticle] = useState(null);
  const [reccomendedArticleList, setReccomendedArticles] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoadingState(true);
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
      } finally {
        setLoadingState(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  useEffect(() => {
    setLoadingState(true);
    const fetchReccomendations = async () => {
    try{
        const articleId = article?.articleId;
        let articleList = (await reccomendArticles(articleId)).data;
        setReccomendedArticles(articleList);
     
    }catch(err){
      console.log(err);
    }finally{
      setLoadingState(false);
    }
  };
    if (article) {
      fetchReccomendations();
    }
  }, [article]);

  if (!article) {
    return <LoadingComponent />;
  }

  const handleNavigate = (id) => {
    navigate(`/articles/readArticles/${id}`);
  };

  return (
    <div>
      <Header />
      <div className="flex justify-between mx-24">
        <div className="w-8/12">
          {loadingState && <LoadingComponent />}
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
          {loadingState? (
            <div className="flex justify-start px-40 py-20 items-center">
                  <div className="h-12 w-4 bg-blue rounded-full animate-pulse mx-5"></div>
                  <div className="h-8 w-4 bg-blue rounded-full animate-pulse delay-200"></div>
                  <div className="h-4 w-4 bg-blue rounded-full animate-pulse delay-400 mx-5"></div>
            </div>
          ): null
          }
          <hr className="border-yellow border-t-4 w-4/4"></hr>
          <br />
          {reccomendedArticleList.map((topArticle, index) =>
            articleId === topArticle.articleId ? (
              <></>
            ) : (
              <div key={index} onClick={() => handleNavigate(topArticle.articleId)}>
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
          {currentUserRole === userRoles.Teacher || currentUserRole === userRoles.Moderator ? (
            <Link to="/articles/addArticleForm">
              <AddArticleBtn />
            </Link>
          ) : null}
          <iframe title="dummy"></iframe>
        </div>
      </div>
      <div className="mx-24">
        <CommentList articleId={article.articleId} />
      </div>
      <Footer />
    </div>
  );
}
