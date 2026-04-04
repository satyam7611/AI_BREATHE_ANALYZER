import axios from "axios";

export const uploadJSONToIPFS = async (data) => {
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data; // contains IpfsHash
  } catch (error) {
    console.error("Pinata Error:", error.message);
    throw error;
  }
};