const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Doctor")}`;

export const buildDoctorImage = (doc, API_BASE) => {
  const img = doc?.image || "";
  if (!img) return `https://ui-avatars.com/api/?name=${encodeURIComponent(doc?.name||"Doctor")}`;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${API_BASE}${img}`;
  return `${API_BASE}/${img}`;
};

 



// export const buildDoctorImage = (doc, API_BASE) => {
//   const img = doc?.image || "";
//   // No image → placeholder avatar
//   if (!img) {
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(doc?.name || "Doctor")}`;
//   }
//   // Absolute (e.g., Cloudinary)
//   if (img.startsWith("http")) return img;

//   // Local static paths
//   if (img.startsWith("/uploads")) return `${API_BASE}${img}`;
//   if (img.startsWith("uploads"))  return `${API_BASE}/${img}`;

//   // Anything else → try relative under server
//   return `${API_BASE}/${img}`;
// };
