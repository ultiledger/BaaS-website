let menus = {
  "constantsValueMap": {
    "CusConstants": {
      "CusArea": {
        "南": "南部",
        "北": "北部",
        "东": "东部",
        "西": "西部"
      }
    }
  },
  "onChain": true,
  "systemMode": "development",
  "user": {
    "userId": "1",
    "userName": "admin",
    "loginName": "admin",
    "password": "",
    "menuTree": [
      {
        "resId": "6774af2997694d4994a1f68bc481e733",
        "resCode": "bsp",
        "resName": "业务中心",
        "resType": "res_type_0,res_type_1",
        "resValue": "bsp.biz",
        "resLevel": 0,
        "resSort": 0,
        "parentId": "",
        "trmlCode": "pc",
        "note": "",
        "resState": "E",
        "extension1": "",
        "extension2": "",
        "children": [
          {
            "resId": "0f11be1817284e41bb4528e0f20205bf",
            "resCode": "biz",
            "resName": "系统管理",
            "resType": "res_type_0",
            "resValue": "",
            "resLevel": 1,
            "resSort": 1,
            "parentId": "6774af2997694d4994a1f68bc481e733",
            "trmlCode": "pc",
            "note": "",
            "resState": "E",
            "extension1": "cbicon cbicon-zichanguanli",
            "extension2": "",
            "children": [
              {
                "resId": "a4e777125bf64fcca5ee79a2af461531",
                "resCode": "notice-list",
                "resName": "公告管理",
                "resType": "res_type_0,res_type_1",
                "resValue": "bsp.biz.notice-list",
                "resLevel": 2,
                "resSort": 1,
                "parentId": "0f11be1817284e41bb4528e0f20205bf",
                "trmlCode": "pc",
                "note": "",
                "resState": "E",
                "extension1": "",
                "extension2": "",
                "children": [],
                "checked": true,
                "openMode": "target_parent"
              }
            ],
            "checked": true,
            "openMode": "target_parent"
          }
        ],
        "checked": true,
        "openMode": "target_parent"
      }
    ],
    "roles": [],
    "roleMap": null,
    "organ": null,
    "ent": {},
    "extension": {
      "isHasAppPermission": true
    }
  },
  "constantsNameValueMap": {
    "CusConstants": {
      "RelType": {
        "MEMBER_SUB_SUPPLIER": "3",
        "FINNER_SUPPLIER": "4",
        "BUYER_SELLER": "1",
        "FINNER_MEMBER": "0",
        "FOCAL_SUB": "2"
      }
    }
  },
  "dictionaryMap": {
  }
};
module.exports = menus;