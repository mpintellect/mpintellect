import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Storage} from "@google-cloud/storage";
import express from "express";
import cors from "cors";

admin.initializeApp();
const app = express();
app.use(cors({origin: true}));

const storage = new Storage();
const bucketName = "mzprimer-data-store";

/**
 * Fetches and streams a file from Google Cloud Storage
 *
 * @param {express.Response} res - Express response object
 * @param {string} filename - Name of the file to fetch from GCS
 * @return {Promise<void>} Promise that resolves when the file is streamed
 */
async function fetchFile(
  res: express.Response,
  filename: string
): Promise<void> {
  try {
    const file = storage.bucket(bucketName).file(filename);
    const [exists] = await file.exists();

    if (!exists) {
      res.status(404).send({error: "File not found"});
      return;
    }

    const [contents] = await file.download();
    const data = JSON.parse(contents.toString("utf8"));
    res.status(200).json(data);
  } catch (error) {
    console.error(`❌ Error fetching ${filename}:`, error);
    res.status(500).send({error: "Internal Server Error"});
  }
}

// ✅ Expose endpoints
app.get("/tradesetup", (req, res) => fetchFile(res, "tradesetup.json"));
app.get("/prices", (req, res) => fetchFile(res, "prices.json"));
app.get("/performance", (req, res) =>
  fetchFile(res, "performance.json")
);

/**
 * Exposes internal API endpoints for reading GCS files
 * (tradesetup, prices, performance)
 */
export const api = functions.https.onRequest(app);
