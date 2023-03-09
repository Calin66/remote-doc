import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const { idpn } = router.query;
  console.log("idpn", idpn);
  return <p>Link: {idpn}</p>;
};

export default Post;
