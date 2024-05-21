import { Axios } from "@/util/http-commons.js";
const http = Axios();

function getArticleListApi(boardType, param, success, fail) {
  http.get(`/${boardType}board/list`, { params: param }).then(success).catch(fail);
}

function getArticleApi(boardType, articleNo, success, fail) {
  http.get(`/${boardType}board/view/${articleNo}`).then(success).catch(fail);
}

function registArticleApi(boardType, article, success, fail) {
  http.post(`/${boardType}board/write`, JSON.stringify(article)).then(success).catch(fail);
}

function modifyArticleApi(boardType, article, success, fail) {
  http.put(`/${boardType}board/modify`, JSON.stringify(article)).then(success).catch(fail);
}

function deleteArticleApi(boardType, articleNo, success, fail) {
  http.delete(`/${boardType}board/delete?articleNo=${articleNo}`).then(success).catch(fail);
}

export { getArticleListApi, getArticleApi, registArticleApi, modifyArticleApi, deleteArticleApi };
