function validatePassword() {
	var password = document.getElementById("joinPwd").value;
	var confirmPassword = document.getElementById("checkPassword").value;
	console.log("들어옴");
	if (password != confirmPassword) {
		alert("비밀번호가 일치하지 않습니다.");
		return false;
	}
	return true;
}
