import { useFetchAllPacienti } from "@/hooks/fetchPacienti";
import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const { idpn } = router.query;

  const { statuss, loading, error } = useFetchAllPacienti(idpn);
  console.log("status in idpn.js", statuss);
  return (
    <p>
      {statuss ? (
        <div>
          <h2></h2>
        </div>
      ) : (
        <div>
          <p>
            Linkul nu mai este valid. Vorbeste cu medicul tau de familie pentru
            a primi un nou link de conectare
          </p>
        </div>
      )}
    </p>
  );
};

export default Post;
