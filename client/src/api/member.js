import { Axios } from "@/util/http-commons.js";

const http = Axios();

// function getSidoApi(success, fail){    
//     http.get('attraction').then(success).catch(fail);
// }
async function userConfirm(param, success, fail){
    await http.post('/member/login', param).then(success).catch(fail);
}

async function updatePwdApi(pwdInfo, success, fail){
    await http.put('/member/updatePwd', pwdInfo).then(success).catch(fail);
}

async function insertMemberApi(member, success, fail){
    await http.post('/member', member).then(success).catch(fail);
}

async function getMemberApi(loginId, success, fail){
    http.defaults.headers["Authorization"] = sessionStorage.getItem("accessToken");
    await http.get(`/member/${loginId}`)
        .then(success).catch(fail)
}

async function updateMemberApi(updateInfo, success, fail){
    http.put('/member', updateInfo).then(success).catch(fail)
}

async function tokenRegeneration(member, success, fail){
    http.defaults.headers["refreshToken"] = sessionStorage.getItem("refreshToken"); //axios header에 refresh-token 셋팅
    await http.post('/member/refresh', member).then(success).catch(fail);
}

async function withdrawMemberApi(member, success, fail){
    await http.put('/member/withdraw', member).then(success).catch(fail)
}

async function logout(loginId, success, fail) {
    console.log("함수 실행");
    await http.get(`/member/logout/${loginId}`).then(success).catch(fail);

  }

export {userConfirm, updatePwdApi, insertMemberApi, getMemberApi, updateMemberApi, tokenRegeneration, withdrawMemberApi, logout };
