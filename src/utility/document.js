// export const buildDocumentUploadPayload = async ({ documents, uploadFileFn, getCategoryIdFn }) => {
//   const payload = [];

import { employeeAPI } from "../api/employeeApi";

//   for (const doc of documents) {
//     const formData = new FormData();
//     formData.append('file', doc.file);

//     const uploadRes = await uploadFileFn(formData);
//     const fileId = uploadRes?.fileIds?.[0]?.file_id;
//     const documentCategoryId = getCategoryIdFn(doc.type);

//     if (fileId && documentCategoryId) {
//       payload.push({
//         document_category_id: documentCategoryId,
//         file_id: fileId,
//       });
//     } else {
//       console.warn('Missing file_id or document_category_id for:', doc);
//     }
//   }

//   return payload;
// };

export const buildDocumentUploadPayload = async (documents) => {
  const payload = [];
  for (const doc of documents) {
    const formData = new FormData();
    formData.append("file", doc.file);
    const uploadRes = await employeeAPI.uploadFile(formData);
    const fileId = uploadRes?.fileIds?.[0]?.file_id;
    if (fileId) {
      payload.push({
        document_category_id: doc.document_category_id,
        file_id: fileId,
      });
    } else {
      console.warn("Missing file_id or document_category_id for:", doc);
    }
  }

  return payload;
};
