import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({
  publicKey: publicKey || "mock_public_key",
  privateKey: privateKey || "mock_private_key",
  urlEndpoint: urlEndpoint || "https://ik.imagekit.io/mock",
});

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
