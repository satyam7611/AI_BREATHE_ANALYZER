import { uploadJSONToIPFS } from "../services/pinataService.js";

export const uploadData = async (req, res) => {
  try {
    const sensorData = req.body;

    const result = await uploadJSONToIPFS(sensorData);

    res.status(200).json({
      success: true,
      cid: result.IpfsHash,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};