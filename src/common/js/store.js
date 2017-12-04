


export function saveToLocal(id,key,val){     //存
 	let seller = window.localStorage._seller_;     //存储格式为json字符窜
 	if(!seller){    //刚开始不存在
 		seller = {};
 		seller[id] = {};
 		seller[id][key] = val;
 	}else{
 		seller = JSON.parse(seller);    //转换为json对象格式
 		if(!seller[id]){
 			seller[id] = {};
 		}
 		seller[id][key] = val;
 	}
 	window.localStorage._seller_ = JSON.stringify(seller);   //当第二次存储的时候再次转换为json字符窜格式
}




export function loadFromLocal(id,key,def){    //读
	let seller = window.localStorage._seller_;     //存储格式为json字符窜
	if(!seller){
		return def;
	}
	seller = JSON.parse(seller)[id];
	if(!seller){
		return def;
	}
	let ret = seller[key];
	return ret || def;
}





















