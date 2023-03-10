import { useFetchAllPacienti } from "@/hooks/fetchPacienti";
import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const { idpn } = router.query;

  const { statuss, loading, error } = useFetchAllPacienti(idpn);
  console.log("status in idpn.js", statuss);
  return <p>Status</p>;
};

export default Post;
