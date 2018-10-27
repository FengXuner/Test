/**
 * @class   PkgMap
 * @info    网络协议Map
 * @author  baofeng
 * @date    2018-10-09
 */
const PkgMap = cc.Class({
    ctor: function () {
		// 记录 PackageType --> Message,  如 _arrIndex[67] = BseLogin
        this._arrIndex = {};
		// 记录 Messsage --> PackageType, 如 _arrIndex[BseLogin] = 67
        this._arrTypes = {};
	},

    AddPkg: function ( type, cls ) {
		if ((this._arrIndex[type] != null)) {
			log("Already register Pakcage Type for " + type);
			return false;
		}
		if (cls == null) {
			log("cls is null for type. " + type);
			return false;
		}

		this._arrIndex[type] = cls;
		this._arrTypes[cls] = type;
		return true;
	},

    GetPkgByType: function ( type ) {
        return this._arrIndex[type];
	},

	GetTypeByPkg: function ( pkg ) {
		return this._arrTypes[pkg];
	},
});

const pkgMap = new PkgMap();
module.exports = pkgMap;