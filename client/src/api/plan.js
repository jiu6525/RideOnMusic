import { Axios } from "@/util/http-commons.js";
const http = Axios();

function registPlanner(plan, success, fail) {
  http.get(`/plan`, { params: plan }).then(success).catch(fail);
}
