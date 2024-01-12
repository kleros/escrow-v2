import { useState, useEffect } from "react";
import fetch from "node-fetch";

const useFetchIpfsJson = (ipfsUri: string) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchJson = async () => {
      if (!ipfsUri) return;

      try {
        const formattedUri = ipfsUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");

        const response = await fetch(formattedUri);
        if (!response.ok) {
          throw new Error(`IPFS fetch failed with status ${response.status}`);
        }
        const jsonData = await response.json();
        console.log(jsonData);
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
