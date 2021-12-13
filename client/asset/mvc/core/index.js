/**
 * ===========================================================================================
 * entry of mvc module
 * ===========================================================================================
 */

var mvc = mvc || {};

class ModelType {
    static get componentType() { return 'model'; }
}
class ViewType {
    static get componentType() { return 'view'; }
}
class BlockType {
    static get componentType() { return 'block'; }
}

mvc.type = {
    ModelType: ModelType,
    ViewType: ViewType,
    BlockType: BlockType
};

mvc.register = function(moduleName, object, objName) {
    var name = objName || object.name;
    var comType = object.componentType;


    if (!name || !moduleName || !comType) {
        return console.warn('Cant not register object', object, name);
    }
    
    var mod = mvc[moduleName] = mvc[moduleName] || {};
    var com = mod[comType] = mod[comType] || {};
    com[name] = object;
};