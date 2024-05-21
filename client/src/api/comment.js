import { Axios } from "@/util/http-commons.js";
const http = Axios();

function getCommentListApi(boardType, articleNo, success, fail) {
  http.get(`/${boardType}comment?articleNo=${articleNo}`).then(success).catch(fail);
}

function registCommentApi(boardType, comment, success, fail) {
  http.post(`/${boardType}comment`, JSON.stringify(comment)).then(success).catch(fail);
}

function modifyCommentApi(boardType, comment, success, fail) {
  http.put(`/${boardType}comment`, JSON.stringify(comment)).then(success).catch(fail);
}

function deleteCommentApi(boardType, commentId, success, fail) {
  http.delete(`/${boardType}comment?commentId=${commentId}`).then(success).catch(fail);
}

export { getCommentListApi, registCommentApi, modifyCommentApi, deleteCommentApi };
