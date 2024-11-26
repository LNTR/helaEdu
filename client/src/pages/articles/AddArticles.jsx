import React, { useEffect, useState } from "react";
import Header from "@components/common/Header";
import { Footer } from "@/components/common";
import { listArticlesByTeacher } from "@/services/ArticleService";
import ArticleCardMe from "@components/articles/ArticleCardMe";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import AddArticleBtn from "@components/articles/AddArticleBtn";
import ArticleHead from "@components/articles/ArticleHead";
import { Link } from "react-router-dom";
import banner from "@assets/img/subject_background.png";

export default function AddArticles() {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    listArticlesByTeacher(headers)
      .then((response) => {
        setArticles(response.data);
        setFilteredArticles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (status === "All") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.status === status));
    }
  };

  return (
    <>
      <Header />
      <div className="subject-catalog">
        <img className="catalog-img" src={banner} alt="" />
        <div className="">
          <ArticleHead onStatusChange={handleStatusChange}/>
          <div className="mx-44 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredArticles.map((article) => (
              <div key={article.articleId} className="p-2">
                <Link to={`/articles/viewArticleMyself/${article.articleId}`}>
                  <ArticleCardMe
                    imageUrl={article.imageRef}
                    title={article.title}
                    description={article.content}
                    badges={article.tags}
                    status={article.status}
                    date={article.publishedTimestamp}
                    articleId={article.articleId}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
