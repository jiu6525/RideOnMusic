import { Axios } from "@/util/http-commons.js";
const http = Axios();

function getSidoApi(success, fail){    
    http.get('attraction').then(success).catch(fail);
}

function searchApi (searchItem, success, fail){
    http.post('attraction/search', searchItem).then(success).catch(fail);
}

export { getSidoApi, searchApi };
