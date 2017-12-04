
/*
	解析url参数；
	@example ?id=12345&a=张敏
	@return Object {id:12345,a:张敏}

 */

export function urlParse(){
	let url = window.location.search;
	let obj = {};
	let reg = /[?&][^?&]+=[^?&]+/g;
	let arr = url.match(reg);
	if(arr){
		arr.forEach((item) => {
			let tempArr = item.substring(1).split('=');
			let key = decodeURIComponent(tempArr[0]);
			let val = decodeURIComponent(tempArr[1]);
			obj[key] = val;
		});
	}
	// console.log(obj);
	return obj;
}


















