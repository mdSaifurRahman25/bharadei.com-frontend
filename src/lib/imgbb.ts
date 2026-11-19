export async function uploadImageToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "imgbb API key is not configured (NEXT_PUBLIC_IMGBB_API_KEY). Please paste an image URL or add your key."
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const payload = await response.json();
  if (!response.ok || !payload?.success || !payload?.data?.display_url) {
    throw new Error(
      payload?.error?.message || "Failed to upload image to imgbb."
    );
  }

  return payload.data.display_url as string;
}
