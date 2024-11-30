import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function Test() {
  const headers = useAuthHeader();
  return <>Test here</>;
}
export default Test;
