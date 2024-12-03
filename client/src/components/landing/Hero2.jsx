import React, { useEffect, useState } from "react";
import bot from "@assets/img/bot.svg";
import logo from "@assets/icons/hela-edu-black-text2.svg";
import land from "@assets/img/Land bg.svg";
import { useNavigate } from "react-router-dom";
import maths from "@assets/img/subjects/maths.png";
import science from "@assets/img/subjects/2.png";
import geography from "@assets/img/subjects/3.png";
import bussiness from "@assets/img/subjects/4.png";
import buddhism from "@assets/img/subjects/5.png";
import islam from "@assets/img/subjects/6.png";
import christian from "@assets/img/subjects/7.png";
import hinduism from "@assets/img/subjects/8.png";
import Article from "@components/landing/Article";
import { getTopArticles } from "@services/ArticleService";
import { listAllUsersDetails } from "@services/TeacherService";
import { getUpvoteCountByArticleId } from "@services/ArticleService";
import { getCommentCountByArticleId } from "@services/ArticleService";
import FormatToYYMMDD from "@components/common/FormatToYYMMDD";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { userRoles } from "@utils/userRoles";

function Hero2() {
  const navigate = useNavigate();
  const currentUserRole = useAuthUser()?.role;

  const [topArticles, setTopArticles] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  const truncateContent = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  useEffect(() => {
    const fetchArticlesAndDetails = async () => {
      try {
        setLoadingState(true);
        const articlesResponse = await getTopArticles();
        const articles = articlesResponse.data;

        const articlesWithDetails = await Promise.all(
          articles.map(async (article) => {
            try {
              const userResponse = await listAllUsersDetails(article.userId);
              const author = userResponse.data;

              const upvoteResponse = await getUpvoteCountByArticleId(
                article.articleId
              );
              const upvoteCount = upvoteResponse.data;

              const commentResponse = await getCommentCountByArticleId(
                article.articleId
              );
              const commentCount = commentResponse.data;

              const truncatedTitle = truncateContent(article.title, 5);
              const truncatedContent = truncateContent(article.content, 40);
              const date = FormatToYYMMDD(article.publishedTimestamp);
              return {
                ...article,
                author,
                upvoteCount,
                commentCount,
                truncatedTitle,
                truncatedContent,
                date,
              };
            } catch (error) {
              console.error(
                `Error fetching details for articleId: ${article.articleId}`,
                error
              );
              return {
                ...article,
                author: null,
                upvoteCount: 0,
                commentCount: 0,
              };
            } finally {
              setLoadingState(false);
            }
          })
        );

        setTopArticles(articlesWithDetails);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticlesAndDetails();
  }, []);
  return (
    <div className="hero2">
      <div className="flex-c">
        <img src={logo} alt="" srcSet="" className="banner-logo" />
      </div>
      <div>
        <img src={land} alt="" srcSet="" className="banner-bg" />
      </div>
      <main className="pannels">
        <div className="left-pannel flex-c">
          <div className="hero-text-box">
            {userRoles.Student == currentUserRole ? (
              <div className="subscribe">
                <h3 className="text-center blue">Subscribe to premium now</h3>
                <h3
                  className="text-center white"
                  onClick={() => {
                    navigate("/premiumPlan");
                  }}
                >
                  Subscribe
                </h3>
              </div>
            ) : (
              <></>
            )}

            <h4 className="mt-4">
              Your ultimate self-study platform, designed to make learning
              engaging and effective. Start your journey to academic excellence
              today with HelaEdu!
            </h4>
            <h3 className="mt-4">
              Unlock Your Academic Potential with HelaEdu!
            </h3>
          </div>
        </div>
        <div className="right-pannel">
          <div className="chat-box flex-col-sa box-shadow">
            <h2 className="text-center">
              Hey! <br />
              Need Help in academics?
            </h2>
            <div className="chat-buttons">
              <div className="button-wrapper" style={{ gridArea: "button1" }}>
                <button className="blue-button">
                  <h4>Geography</h4>
                </button>
              </div>
              <div className="button-wrapper" style={{ gridArea: "button2" }}>
                <button className="blue-button">
                  <h4>ICT</h4>
                </button>
              </div>
              <div className="button-wrapper" style={{ gridArea: "button3" }}>
                <button className="blue-button">
                  <h4>Science</h4>
                </button>
              </div>
            </div>
            <div className="w-10/12">
              <button className="btn black-button w-full">
                <h3>Start a chat</h3>
              </button>
            </div>
          </div>
          <div className="bot-wrapper flex-end">
            <img src={bot} alt="" className="" />
          </div>
        </div>
      </main>
      <section className="subject-section">
        <h3>Subjects</h3>
        <div className="my-4">
          <div className="flex-sa">
            <button
              className="lg:tooltip custom-tooltip"
              data-tip="Mathematics"
            >
              <div className="subject-circles">
                <img src={maths} alt="image" />
              </div>
            </button>
            <div className="lg:tooltip custom-tooltip" data-tip="Science">
              <div className="subject-circles">
                <img src={science} alt="image" />
              </div>
            </div>
            <div className="lg:tooltip custom-tooltip" data-tip="Geography">
              <div className="subject-circles">
                <img src={geography} alt="image" />
              </div>
            </div>
            <div
              className="lg:tooltip custom-tooltip"
              data-tip="B. Studies & Acc."
            >
              <div className="subject-circles">
                <img src={bussiness} alt="image" />
              </div>
            </div>
            <div className="lg:tooltip custom-tooltip" data-tip="Buddhism">
              <div className="subject-circles">
                <img src={buddhism} alt="image" />
              </div>
            </div>
            <div className="lg:tooltip custom-tooltip" data-tip="Hinduism">
              <div className="subject-circles">
                <img src={hinduism} alt="image" />
              </div>
            </div>
            <div className="lg:tooltip custom-tooltip" data-tip="Christian">
              <div className="subject-circles">
                <img src={christian} alt="image" />
              </div>
            </div>
            <div className="lg:tooltip custom-tooltip" data-tip="Islam">
              <div className="subject-circles">
                <img src={islam} alt="image" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="article-header">
        <h3>Most Popular Articles</h3>
      </div>
      <section className="article-section">
        {loadingState ? (
          <div className="flex justify-start px-40 py-20 items-center">
            <div className="h-12 w-4 bg-blue rounded-full animate-pulse mx-5"></div>
            <div className="h-8 w-4 bg-blue rounded-full animate-pulse delay-200"></div>
            <div className="h-4 w-4 bg-blue rounded-full animate-pulse delay-400 mx-5"></div>
          </div>
        ) : null}
        {topArticles.map((article, index) => (
          <Article
            key={article.articleId}
            articleId={article.articleId}
            publishedTimestamp={article.date}
            img={article.imageRef}
            alignment={index % 2 === 0 ? "right" : "left"}
            title={article.truncatedTitle}
            content={article.truncatedContent}
            author={article.author}
            upvoteCount={article.upvoteCount}
            commentCount={article.commentCount}
          />
        ))}
      </section>
    </div>
  );
}

export default Hero2;
