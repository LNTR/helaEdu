import AddArticleBtn from "@/components/articles/AddArticleBtn";
import AddComment from "@/components/articles/AddComment";
import CommentList from "@/components/articles/CommentList";
import Comments from "@/components/articles/Comments";
import PopArticleCard from "@/components/articles/PopArticleCard";
import ViewArticle from "@/components/articles/ViewArticle";
import React from "react";
import { Footer} from "@/components/common";
import Header from "@components/teacher_com/Header";
import { Link } from "react-router-dom";
import { getArticleById } from "@/services/ArticleService";

export default function ReadArticle() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await getArticleById(articleId);
        setArticle(response.data);
      } catch (error) {
        console.error("Failed to fetch article", error);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <div>Loading...</div>; // Or a loading spinner
  }
  return (
    <div>
      <Header />
      <div className="flex justify-between">
        <div className="w-5/6">
          <ViewArticle 
              title={article.title}
              content={article.content}
              
            />
        </div>
        <div className="m-12">
          <h1>Top Articles</h1>
          <hr className="border-yellow border-t-4 w-1/4"></hr>
          <br></br>
          <PopArticleCard />
          <PopArticleCard />
          <PopArticleCard />
          <PopArticleCard />
          <PopArticleCard />
          <Link to="/addArticleForm">
            <AddArticleBtn />
          </Link>

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
