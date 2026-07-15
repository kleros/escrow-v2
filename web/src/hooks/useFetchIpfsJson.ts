import { useState, useEffect } from "react";
import { isContentAddressed, toHttpUrl } from "utils/ipfs";

const useFetchIpfsJson = (ipfsUri: string) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchJson = async () => {
      if (!ipfsUri) return;

      try {
        const url = toHttpUrl(ipfsUri);
        if (!url || !isContentAddressed(ipfsUri)) {
          throw new Error(`URI is not content-addressed: ${ipfsUri}`);
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`IPFS fetch failed with status ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error(err);
        setData(null);
      }
    };

    fetchJson();
  }, [ipfsUri]);

  return data;
};

export default useFetchIpfsJson;
