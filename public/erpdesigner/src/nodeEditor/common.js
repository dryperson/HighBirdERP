function MK_NS_Settings(label, type, defval){
    return{
        label:label,
        type:type,
        defval:defval
    };
}

function CommonFun_SetCurrentComponent(target){
    if(this.currentComponent != target){
        this.currentComponent = target;
        this.emit(Event_CurrentComponentchanged, this);
    }
}

class CompileResult{
    constructor(node){
        this.node = node;
        this.socketOuts = {};
    }
    
    setSocketOut(socket, strContent, data){
        this.socketOuts[socket.id]={
            strContent:strContent,
            data:data,
        }
    }

    setDirectOut(strContent,data){
        this.directOut={
            strContent:strContent,
            data:data,
        }
    }

    getSocketOut(socket){
        return this.socketOuts[socket.id];
    }

    getDirectOut(){
        return this.directOut;
    }
}

class ContextFinder{
    constructor(type){
        this.type = type;
        this.item_arr = [];
    }

    addItem(label,data){
        if(data == null){
            return;
        }
        if(label == null){
            console.warn('context meet null label');
            label = 'unname';
        }
        this.item_arr.push({label:label,data:data});
    }

    setTest(key){
        this['test-' + key] = 1;
    }

    isTest(key){
        return this['test-' + key] == 1;
    }

    count(){
        return this.item_arr.length;
    }
}