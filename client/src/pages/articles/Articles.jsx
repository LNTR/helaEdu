import React, { useState, useEffect } from "react";
import { Header, Footer } from "@/components/common";
import ArticleCard from "@components/articles/ArticleCard";
import { approvedArticles } from "@/services/ArticleService";
import { getUserDetails } from "@/services/TeacherService";
import { Link } from "react-router-dom";
import banner from "@assets/img/subject_background.png";
import ArticleHeadForAll from "@components/articles/ArticleHeadForAll";
import LoadingComponent from "@components/common/LoadingComponent";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState(8);
  const [loadingState, setLoadingState] = useState(false);
  useEffect(() => {
    const fetchApprovedArticles = async () => {
      setLoadingState(true); 
      try {
        const response = await approvedArticles();
        const articles = response.data;

        const articlesWithUserDetails = await Promise.all(
          articles.map(async (article) => {
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
        setFilteredArticles(articlesWithUserDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); 
      }
    };

    fetchApprovedArticles();
  }, []);

  const handleSearch = (searchBy, query) => {
    if (!query) {
      setFilteredArticles(articles);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = articles.filter((article) => {
      if (searchBy === "All") {
        return (
          article.title.toLowerCase().includes(lowerCaseQuery) ||
          article.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)) ||
          article.content.toLowerCase().includes(lowerCaseQuery) ||
          `${article.firstName} ${article.lastName}`.toLowerCase().includes(lowerCaseQuery)
        );
      }
      if (searchBy === "Author") {
        return `${article.firstName} ${article.lastName}`.toLowerCase().includes(lowerCaseQuery);
      }
      if (searchBy === "Title") {
        return article.title.toLowerCase().includes(lowerCaseQuery);
      }
      if (searchBy === "Tags") {
        return article.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery));
      }
      if (searchBy === "Description") {
        return article.content.toLowerCase().includes(lowerCaseQuery);
      }
      return false;
    });

    setFilteredArticles(filtered);
  };

  const handleSeeMore = () => {
    setVisibleArticles((prevVisible) => prevVisible + 4);
  };

  return (
    <>
      <Header />
      <div className={`subject-catalog `}>
      {loadingState && (
        <LoadingComponent/>
      )}


        <img className="catalog-img" src={banner} alt="" />
        <div>
          <ArticleHeadForAll onSearch={handleSearch} />
          <div className="mx-44 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredArticles.slice(0, visibleArticles).map((article) => (
              <div key={article.articleId} className="p-2">
                <Link to={`/articles/readArticles/${article.articleId}`}>
                  <ArticleCard
                    key={article.articleId}
                    imageUrl={article.imageRef}
                    profilePictureUrl={article.coverImage}
                    firstName={article.firstName}
                    lastName={article.lastName}
                    date={article.publishedTimestamp}
                    title={article.title}
                    description={article.content}
                    badges={article.tags}
                    articleId={article.articleId}
                  />
                </Link>
              </div>
            ))}
          </div>
          {visibleArticles < filteredArticles.length && (
            <div className="text-right mt-4">
              <button
                className="text-blue px-4 py-2 rounded text-2xl mr-64"
                onClick={handleSeeMore}
              >
                See More
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Articles;
